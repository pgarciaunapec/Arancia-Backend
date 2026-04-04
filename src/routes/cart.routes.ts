import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Order, MenuItem } from '../models/index';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types/index';

const router: import('express').Router = Router();

// Helper to get or create cart
const getCartResponse = async (userId: string) => {
    let cart = await Order.findOne({ user: userId, status: 'cart' })
        .populate('items.menuItem', 'image name price');

    if (!cart) {
        cart = await Order.create({ user: userId, status: 'cart', items: [] });
        return cart;
    }

    // Transform items to include image and keep menuItem as ID
    const cartObj = cart.toObject();
    cartObj.items = cartObj.items.map((item: any) => {
        // Check if menuItem is populated (it might be null if item was deleted)
        if (item.menuItem && typeof item.menuItem === 'object') {
            return {
                ...item,
                menuItem: item.menuItem._id.toString(),
                image: item.menuItem.image,
                name: item.menuItem.name,
                price: item.menuItem.price
            };
        }
        return item;
    });

    return cartObj;
};

// @route   GET /api/cart
// @desc    Get current cart
// @access  Private
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const cart = await getCartResponse(req.user!.id);
        res.json({
            success: true,
            data: cart,
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// @route   POST /api/cart/merge
// @desc    Merge guest cart into authenticated cart
// @access  Private
router.post(
    '/merge',
    authMiddleware,
    [
        body('items').isArray({ min: 1 }).withMessage('Items requeridos'),
        body('items.*.menuItemId').notEmpty().withMessage('ID del plato requerido'),
        body('items.*.quantity').isInt({ min: 1 }).withMessage('Cantidad inválida'),
    ],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const incomingItems = req.body.items as Array<{
                menuItemId: string;
                quantity: number;
            }>;

            // Get or create cart
            let cart = await Order.findOne({ user: req.user!.id, status: 'cart' });
            if (!cart) {
                cart = await Order.create({ user: req.user!.id, status: 'cart', items: [] });
            }

            const menuIds = Array.from(new Set(incomingItems.map((item) => item.menuItemId)));
            const menuItems = await MenuItem.find({
                _id: { $in: menuIds },
                available: true,
            });
            const menuMap = new Map(menuItems.map((item) => [item._id.toString(), item]));

            for (const incoming of incomingItems) {
                const menuItem = menuMap.get(incoming.menuItemId);
                if (!menuItem) {
                    continue;
                }

                const existingItemIndex = cart.items.findIndex(
                    (item) => item.menuItem.toString() === incoming.menuItemId,
                );

                if (existingItemIndex > -1) {
                    cart.items[existingItemIndex].quantity += incoming.quantity;
                } else {
                    cart.items.push({
                        menuItem: menuItem._id as any,
                        name: menuItem.name,
                        quantity: incoming.quantity,
                        price: menuItem.price,
                    });
                }
            }

            await cart.save();

            const populatedCart = await getCartResponse(req.user!.id);
            res.json({
                success: true,
                data: populatedCart,
                message: 'Carrito combinado exitosamente',
            });
        } catch (error) {
            console.error('Merge cart error:', error);
            res.status(500).json({ error: 'Error al combinar carrito' });
        }
    },
);

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post(
    '/',
    authMiddleware,
    [
        body('menuItemId').notEmpty().withMessage('ID del plato requerido'),
        body('quantity').isInt({ min: 1 }).withMessage('Cantidad inválida'),
    ],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { menuItemId, quantity } = req.body;

            // Get menu item
            const menuItem = await MenuItem.findById(menuItemId);
            if (!menuItem) {
                res.status(404).json({ error: 'Plato no encontrado' });
                return;
            }

            if (!menuItem.available) {
                res.status(400).json({ error: 'Este plato no está disponible' });
                return;
            }

            // Get or create cart (raw document for editing)
            let cart = await Order.findOne({ user: req.user!.id, status: 'cart' });
            if (!cart) {
                cart = await Order.create({ user: req.user!.id, status: 'cart', items: [] });
            }

            // Check if item already in cart
            const existingItemIndex = cart.items.findIndex(
                item => item.menuItem.toString() === menuItemId
            );

            if (existingItemIndex > -1) {
                // Update quantity
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({
                    menuItem: menuItem._id as any,
                    name: menuItem.name,
                    quantity,
                    price: menuItem.price,
                });
            }

            await cart.save();

            // Return full populated response
            const populatedCart = await getCartResponse(req.user!.id);

            res.json({
                success: true,
                data: populatedCart,
                message: 'Item agregado al carrito',
            });
        } catch (error) {
            console.error('Add to cart error:', error);
            res.status(500).json({ error: 'Error al agregar al carrito' });
        }
    }
);

// @route   PUT /api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put(
    '/:itemId',
    authMiddleware,
    [body('quantity').isInt({ min: 1 }).withMessage('Cantidad inválida')],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { itemId } = req.params;
            const { quantity } = req.body;

            const cart = await Order.findOne({ user: req.user!.id, status: 'cart' });
            if (!cart) {
                res.status(404).json({ error: 'Carrito no encontrado' });
                return;
            }

            const itemIndex = cart.items.findIndex(
                item => item.menuItem.toString() === itemId
            );

            if (itemIndex === -1) {
                res.status(404).json({ error: 'Item no encontrado en el carrito' });
                return;
            }

            cart.items[itemIndex].quantity = quantity;
            await cart.save();

            const populatedCart = await getCartResponse(req.user!.id);

            res.json({
                success: true,
                data: populatedCart,
                message: 'Cantidad actualizada',
            });
        } catch (error) {
            console.error('Update cart error:', error);
            res.status(500).json({ error: 'Error al actualizar el carrito' });
        }
    }
);

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { itemId } = req.params;

        const cart = await Order.findOne({ user: req.user!.id, status: 'cart' });
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }

        const itemIndex = cart.items.findIndex(
            item => item.menuItem.toString() === itemId
        );

        if (itemIndex === -1) {
            res.status(404).json({ error: 'Item no encontrado en el carrito' });
            return;
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        const populatedCart = await getCartResponse(req.user!.id);

        res.json({
            success: true,
            data: populatedCart,
            message: 'Item eliminado del carrito',
        });
    } catch (error) {
        console.error('Delete from cart error:', error);
        res.status(500).json({ error: 'Error al eliminar del carrito' });
    }
});

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const cart = await Order.findOne({ user: req.user!.id, status: 'cart' });
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }

        cart.items = [];
        await cart.save();

        const populatedCart = await getCartResponse(req.user!.id);

        res.json({
            success: true,
            data: populatedCart,
            message: 'Carrito vaciado',
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
});

export default router;
