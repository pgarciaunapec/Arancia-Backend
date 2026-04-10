import { Router, Response } from "express";
import { body, query, validationResult } from "express-validator";
import { User, Order } from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";

const router: import('express').Router = Router();

// @route   GET /api/admin/users
// @desc    List users with search, filters, pagination
// @access  Admin
router.get(
  "/",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const filter = req.query.filter as string;

      const query: Record<string, unknown> = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      if (filter === "vip") query.isVip = true;
      if (filter === "regular") query.isVip = { $ne: true };
      if (filter === "staff") query.role = "staff";
      if (filter === "admin") query.role = "admin";

      const total = await User.countDocuments(query);
      const users = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Attach order counts
      const usersWithOrders = await Promise.all(
        users.map(async (user) => {
          const ordersCount = await Order.countDocuments({
            user: user._id,
            status: { $ne: "cart" },
          });
          return { ...user, ordersCount };
        }),
      );

      res.json({
        success: true,
        data: usersWithOrders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Admin get users error:", error);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  },
);

// @route   GET /api/admin/users/:id
// @desc    Get user detail
// @access  Admin
router.get(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      const orders = await Order.find({
        user: user._id,
        status: { $ne: "cart" },
      })
        .sort({ createdAt: -1 })
        .limit(10);

      res.json({
        success: true,
        data: { user, recentOrders: orders },
      });
    } catch (error) {
      console.error("Admin get user error:", error);
      res.status(500).json({ error: "Error al obtener usuario" });
    }
  },
);

// @route   PUT /api/admin/users/:id
// @desc    Edit user
// @access  Admin
router.put(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  [
    body("name").optional().trim().notEmpty(),
    body("email").optional().isEmail(),
    body("phone").optional().trim(),
    body("role").optional().isIn(["customer", "staff", "admin"]),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, email, phone, role } = req.body;
      const update: Record<string, unknown> = {};
      if (name) update.name = name;
      if (email) update.email = email;
      if (phone !== undefined) update.phone = phone;
      if (role) update.role = role;

      const user = await User.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.json({ success: true, data: user });
    } catch (error) {
      console.error("Admin update user error:", error);
      res.status(500).json({ error: "Error al actualizar usuario" });
    }
  },
);

// @route   PATCH /api/admin/users/:id/vip
// @desc    Toggle VIP + set discount
// @access  Admin
router.patch(
  "/:id/vip",
  authMiddleware,
  requireRole(["admin"]),
  [
    body("isVip").isBoolean(),
    body("vipDiscount").optional().isFloat({ min: 0, max: 50 }),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { isVip, vipDiscount } = req.body;
      const update: Record<string, unknown> = { isVip };

      if (isVip) {
        update.vipDiscount = vipDiscount || 0;
        update.vipSince = new Date();
      } else {
        update.vipDiscount = 0;
        update.vipSince = null;
      }

      const user = await User.findByIdAndUpdate(req.params.id, update, {
        new: true,
      }).select("-password");

      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.json({ success: true, data: user });
    } catch (error) {
      console.error("Admin toggle VIP error:", error);
      res.status(500).json({ error: "Error al actualizar VIP" });
    }
  },
);

// @route   DELETE /api/admin/users/:id
// @desc    Soft delete user
// @access  Admin
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true },
      ).select("-password");

      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.json({ success: true, message: "Usuario desactivado" });
    } catch (error) {
      console.error("Admin delete user error:", error);
      res.status(500).json({ error: "Error al desactivar usuario" });
    }
  },
);

export default router;
