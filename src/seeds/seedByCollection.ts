import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import {
  CashRegister,
  Contact,
  DeliveryOrder,
  EventRequest,
  InventoryItem,
  MenuItem,
  Order,
  Payment,
  Reservation,
  Table,
  TableBill,
  Transaction,
  User,
} from "../models";
import { Image } from "../models/Image";

export type SeedCollection =
  | "users"
  | "images"
  | "menu-items"
  | "tables"
  | "inventory-items"
  | "contacts"
  | "event-requests"
  | "reservations"
  | "orders"
  | "payments"
  | "transactions"
  | "delivery-orders"
  | "table-bills"
  | "cash-registers";

type LegacyMenuItem = {
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  image: string;
};

const ALL_COLLECTIONS: SeedCollection[] = [
  "users",
  "images",
  "menu-items",
  "tables",
  "inventory-items",
  "contacts",
  "event-requests",
  "reservations",
  "orders",
  "payments",
  "transactions",
  "delivery-orders",
  "table-bills",
  "cash-registers",
];

const ensure: (condition: unknown, message: string) => asserts condition = (
  condition,
  message,
) => {
  if (!condition) {
    throw new Error(message);
  }
};

const startOfDay = (value: Date = new Date()): Date => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const parseLegacyMenuData = (): LegacyMenuItem[] => {
  const menuFile = path.resolve(process.cwd(), "docs/AntinguoMenu.md");
  const content = fs.readFileSync(menuFile, "utf8");

  const itemRegex =
    /\{\s*id:\s*\d+,\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*price:\s*(\d+(?:\.\d+)?),\s*ingredients:\s*\[(.*?)\],\s*image:\s*"([^"]+)"\s*\}/gs;

  const items: LegacyMenuItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(content)) !== null) {
    const ingredients = Array.from(match[4].matchAll(/"([^"]+)"/g)).map(
      (ingredientMatch) => ingredientMatch[1].trim(),
    );

    items.push({
      name: match[1].trim(),
      category: match[2].trim(),
      price: Number(match[3]),
      ingredients,
      image: match[5].trim(),
    });
  }

  ensure(
    items.length > 0,
    "No se pudo extraer menú desde docs/AntinguoMenu.md",
  );

  return items;
};

const pickOrderItems = (
  menuItems: Array<{ _id: mongoose.Types.ObjectId; name: string; price: number }>,
  indexes: number[],
): Array<{
  menuItem: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}> => {
  return indexes.map((index, idx) => {
    const item = menuItems[index % menuItems.length];
    return {
      menuItem: item._id,
      name: item.name,
      quantity: idx % 2 === 0 ? 1 : 2,
      price: item.price,
    };
  });
};

const seedUsers = async (): Promise<number> => {
  await User.deleteMany({});

  await User.create([
    {
      name: "Administrador Arancia",
      email: "admin@arancia.com",
      password: "Admin123",
      phone: "8090001001",
      address: "Oficina principal",
      role: "admin",
      isVip: false,
    },
    {
      name: "Supervisor Turno",
      email: "staff@arancia.com",
      password: "Staff123",
      phone: "8090001002",
      address: "Sucursal centro",
      role: "staff",
      isVip: false,
    },
    {
      name: "Laura Perez",
      email: "laura@cliente.com",
      password: "Cliente123",
      phone: "8090002001",
      address: "Naco, Santo Domingo",
      role: "customer",
      isVip: true,
      vipDiscount: 10,
      vipSince: new Date("2025-06-10"),
    },
    {
      name: "Carlos Gomez",
      email: "carlos@cliente.com",
      password: "Cliente123",
      phone: "8090002002",
      address: "Piantini, Santo Domingo",
      role: "customer",
      isVip: false,
    },
    {
      name: "Maria Fernandez",
      email: "maria@cliente.com",
      password: "Cliente123",
      phone: "8090002003",
      address: "Arroyo Hondo, Santo Domingo",
      role: "customer",
      isVip: false,
    },
  ]);

  return User.countDocuments();
};

const seedImages = async (): Promise<number> => {
  await Image.deleteMany({});

  const placeholders = Array.from({ length: 12 }, (_, index) => ({
    filename: `seed-image-${index + 1}.jpg`,
    contentType: "image/jpeg",
    data: Buffer.from(`seed-image-content-${index + 1}`, "utf8"),
  }));

  await Image.insertMany(placeholders);
  return Image.countDocuments();
};

const seedMenuItems = async (): Promise<number> => {
  const legacyItems = parseLegacyMenuData();

  await MenuItem.deleteMany({});

  await MenuItem.insertMany(
    legacyItems.map((item) => ({
      ...item,
      available: true,
    })),
  );

  return MenuItem.countDocuments();
};

const seedTables = async (): Promise<number> => {
  await Table.deleteMany({});

  await Table.insertMany([
    { number: 1, capacity: 2, zone: "Salon Principal", status: "available" },
    { number: 2, capacity: 2, zone: "Salon Principal", status: "available" },
    { number: 3, capacity: 4, zone: "Salon Principal", status: "available" },
    { number: 4, capacity: 4, zone: "Salon Principal", status: "available" },
    { number: 5, capacity: 6, zone: "Terraza", status: "available" },
    { number: 6, capacity: 6, zone: "Terraza", status: "reserved" },
    { number: 7, capacity: 8, zone: "Salon VIP", status: "available" },
    { number: 8, capacity: 8, zone: "Salon VIP", status: "available" },
    { number: 9, capacity: 10, zone: "Eventos", status: "available" },
    { number: 10, capacity: 10, zone: "Eventos", status: "maintenance" },
  ]);

  return Table.countDocuments();
};

const seedInventoryItems = async (): Promise<number> => {
  await InventoryItem.deleteMany({});

  await InventoryItem.insertMany([
    {
      name: "Pechuga de pollo",
      category: "Proteinas",
      currentStock: 24,
      minimumStock: 10,
      unit: "kg",
      costPerUnit: 185,
      supplier: "Carnes del Caribe",
      isActive: true,
    },
    {
      name: "Carne de res",
      category: "Proteinas",
      currentStock: 18,
      minimumStock: 8,
      unit: "kg",
      costPerUnit: 290,
      supplier: "Carnes del Caribe",
      isActive: true,
    },
    {
      name: "Camarones",
      category: "Mariscos",
      currentStock: 7,
      minimumStock: 8,
      unit: "kg",
      costPerUnit: 430,
      supplier: "Mar Azul",
      isActive: true,
    },
    {
      name: "Pescado filete",
      category: "Mariscos",
      currentStock: 0,
      minimumStock: 6,
      unit: "kg",
      costPerUnit: 390,
      supplier: "Mar Azul",
      isActive: true,
    },
    {
      name: "Arroz",
      category: "Granos",
      currentStock: 45,
      minimumStock: 15,
      unit: "kg",
      costPerUnit: 42,
      supplier: "Distribuidora Central",
      isActive: true,
    },
    {
      name: "Aceite vegetal",
      category: "Despensa",
      currentStock: 16,
      minimumStock: 8,
      unit: "litro",
      costPerUnit: 95,
      supplier: "Distribuidora Central",
      isActive: true,
    },
    {
      name: "Harina",
      category: "Despensa",
      currentStock: 6,
      minimumStock: 6,
      unit: "kg",
      costPerUnit: 52,
      supplier: "Molinos del Sur",
      isActive: true,
    },
    {
      name: "Cebolla",
      category: "Vegetales",
      currentStock: 11,
      minimumStock: 6,
      unit: "kg",
      costPerUnit: 48,
      supplier: "Agro Mercado",
      isActive: true,
    },
    {
      name: "Tomate",
      category: "Vegetales",
      currentStock: 5,
      minimumStock: 7,
      unit: "kg",
      costPerUnit: 44,
      supplier: "Agro Mercado",
      isActive: true,
    },
    {
      name: "Refrescos",
      category: "Bebidas",
      currentStock: 84,
      minimumStock: 24,
      unit: "unidad",
      costPerUnit: 36,
      supplier: "Bebidas Unidas",
      isActive: true,
    },
    {
      name: "Agua",
      category: "Bebidas",
      currentStock: 96,
      minimumStock: 30,
      unit: "unidad",
      costPerUnit: 22,
      supplier: "Bebidas Unidas",
      isActive: true,
    },
    {
      name: "Servilletas",
      category: "Limpieza",
      currentStock: 14,
      minimumStock: 5,
      unit: "paquete",
      costPerUnit: 120,
      supplier: "Suministros Express",
      isActive: true,
    },
  ]);

  return InventoryItem.countDocuments();
};

const seedContacts = async (): Promise<number> => {
  await Contact.deleteMany({});

  await Contact.insertMany([
    {
      name: "Daniela Mora",
      email: "daniela@email.com",
      phone: "8097771001",
      message: "Quiero conocer disponibilidad para una reservacion de 12 personas.",
      status: "unread",
    },
    {
      name: "Juan Castillo",
      email: "juan@email.com",
      phone: "8097771002",
      message: "Excelente servicio en mi ultima visita, gracias.",
      status: "read",
    },
    {
      name: "Carla Reyes",
      email: "carla@email.com",
      phone: "8097771003",
      message: "Necesito factura con comprobante fiscal para un evento corporativo.",
      status: "responded",
    },
  ]);

  return Contact.countDocuments();
};

const seedEventRequests = async (): Promise<number> => {
  await EventRequest.deleteMany({});

  await EventRequest.insertMany([
    {
      name: "Pedro Acosta",
      email: "pedro@empresa.com",
      phone: "8098882001",
      eventType: "corporativo",
      packageName: "Premium",
      guests: 60,
      preferredDate: new Date("2026-05-12"),
      notes: "Necesitamos proyector y microfonos.",
      status: "pending",
    },
    {
      name: "Sofia Linares",
      email: "sofia@email.com",
      phone: "8098882002",
      eventType: "social",
      packageName: "Elite",
      guests: 120,
      preferredDate: new Date("2026-06-20"),
      notes: "Celebracion de aniversario.",
      status: "contacted",
    },
    {
      name: "Raul Mejia",
      email: "raul@email.com",
      phone: "8098882003",
      eventType: "privado",
      packageName: "Esencial",
      guests: 25,
      preferredDate: new Date("2026-04-25"),
      notes: "Cena familiar privada.",
      status: "confirmed",
    },
  ]);

  return EventRequest.countDocuments();
};

const seedReservations = async (): Promise<number> => {
  const customers = await User.find({ role: "customer" }).sort({ createdAt: 1 });
  ensure(
    customers.length >= 2,
    "Se requieren al menos 2 clientes para sembrar reservaciones. Ejecuta seed de users primero.",
  );

  await Reservation.deleteMany({});

  const today = startOfDay();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  await Reservation.insertMany([
    {
      user: customers[0]._id,
      date: today,
      time: "19:30",
      guests: 4,
      name: customers[0].name,
      email: customers[0].email,
      phone: customers[0].phone,
      notes: "Mesa cerca de la terraza",
      status: "confirmed",
      location: "Restaurante Principal",
    },
    {
      user: customers[1]._id,
      date: tomorrow,
      time: "20:00",
      guests: 2,
      name: customers[1].name,
      email: customers[1].email,
      phone: customers[1].phone,
      notes: "Celebracion de cumpleanos",
      status: "pending",
      location: "Salon VIP",
    },
    {
      user: customers[0]._id,
      date: nextWeek,
      time: "13:00",
      guests: 6,
      name: customers[0].name,
      email: customers[0].email,
      phone: customers[0].phone,
      notes: "Reserva para reunion familiar",
      status: "completed",
      location: "Restaurante Principal",
    },
  ]);

  return Reservation.countDocuments();
};

const seedOrders = async (): Promise<number> => {
  const customers = await User.find({ role: "customer" }).sort({ createdAt: 1 });
  ensure(
    customers.length >= 2,
    "Se requieren clientes para sembrar ordenes. Ejecuta seed de users primero.",
  );

  const menuItems = await MenuItem.find().limit(20);
  ensure(
    menuItems.length >= 8,
    "Se requieren items de menu para sembrar ordenes. Ejecuta seed de menu-items primero.",
  );

  await Order.deleteMany({});

  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

  const ordersToCreate = [
    {
      user: customers[0]._id,
      items: pickOrderItems(menuItems as any, [0, 1, 2]),
      status: "delivered",
      paymentStatus: "paid",
      isDelivery: true,
      shippingAddress: {
        name: customers[0].name,
        address: "Naco #25",
        city: "Santo Domingo",
        zip: "10101",
      },
      createdAt: fiveHoursAgo,
    },
    {
      user: customers[1]._id,
      items: pickOrderItems(menuItems as any, [3, 4]),
      status: "preparing",
      paymentStatus: "paid",
      isDelivery: false,
      createdAt: twoHoursAgo,
    },
    {
      user: customers[0]._id,
      items: pickOrderItems(menuItems as any, [5, 6, 7]),
      status: "confirmed",
      paymentStatus: "pending",
      isDelivery: true,
      shippingAddress: {
        name: customers[0].name,
        address: "Piantini #70",
        city: "Santo Domingo",
        zip: "10112",
      },
      createdAt: now,
    },
    {
      user: customers[1]._id,
      items: pickOrderItems(menuItems as any, [8, 9]),
      status: "pending",
      paymentStatus: "pending",
      isDelivery: false,
      createdAt: now,
    },
  ];

  for (const payload of ordersToCreate) {
    const order = new Order(payload as any);
    await order.save();
  }

  return Order.countDocuments({ status: { $ne: "cart" } });
};

const seedPayments = async (): Promise<number> => {
  const paidOrders = await Order.find({ paymentStatus: "paid", status: { $ne: "cart" } })
    .sort({ createdAt: 1 })
    .populate("user", "_id");

  ensure(
    paidOrders.length > 0,
    "No hay ordenes pagadas para sembrar pagos. Ejecuta seed de orders primero.",
  );

  await Payment.deleteMany({});

  const methods: Array<"cash" | "card" | "transfer"> = ["card", "cash", "transfer"];

  let index = 1;
  for (const order of paidOrders) {
    const method = methods[(index - 1) % methods.length];
    const paymentPayload: Record<string, unknown> = {
      order: order._id,
      user: order.user,
      amount: order.total,
      method,
      status: "completed",
      reference: `PAY-SEED-${String(index).padStart(4, "0")}`,
    };

    if (method === "card") {
      paymentPayload.last4Digits = "4242";
      paymentPayload.cardHash = "seed-hash-4242";
    }

    if (method === "transfer") {
      paymentPayload.transferReference = `TRF-SEED-${String(index).padStart(4, "0")}`;
    }

    await Payment.create(paymentPayload);
    index += 1;
  }

  return Payment.countDocuments();
};

const seedTransactions = async (): Promise<number> => {
  const payments = await Payment.find({ status: "completed" }).sort({ createdAt: 1 });
  ensure(
    payments.length > 0,
    "No hay pagos completados para sembrar transacciones. Ejecuta seed de payments primero.",
  );

  await Transaction.deleteMany({});

  const txPayload = payments.map((payment) => ({
    payment: payment._id,
    type: "charge",
    amount: payment.amount,
    status: "completed",
    metadata: {
      reference: payment.reference,
      method: payment.method,
    },
  }));

  await Transaction.insertMany(txPayload);
  return Transaction.countDocuments();
};

const seedDeliveryOrders = async (): Promise<number> => {
  const deliveryOrdersSource = await Order.find({
    isDelivery: true,
    status: { $ne: "cart" },
  }).sort({ createdAt: 1 });

  ensure(
    deliveryOrdersSource.length > 0,
    "No hay ordenes delivery para sembrar deliveries. Ejecuta seed de orders primero.",
  );

  await DeliveryOrder.deleteMany({});

  for (const order of deliveryOrdersSource) {
    const mappedStatus =
      order.status === "delivered"
        ? "delivered"
        : order.status === "confirmed"
          ? "assigned"
          : order.status === "preparing"
            ? "in_transit"
            : "pending";

    await DeliveryOrder.create({
      order: order._id,
      user: order.user,
      status: mappedStatus,
      deliveryAddress: order.shippingAddress || {
        name: "Cliente",
        address: "Sin direccion",
        city: "Santo Domingo",
        zip: "00000",
      },
      agent:
        mappedStatus === "delivered" || mappedStatus === "in_transit"
          ? {
              name: "Juan Repartidor",
              phone: "8095550001",
            }
          : undefined,
      estimatedMinutes: mappedStatus === "delivered" ? 0 : 35,
      estimatedArrival:
        mappedStatus === "delivered"
          ? new Date(order.updatedAt)
          : new Date(Date.now() + 35 * 60 * 1000),
      deliveredAt: mappedStatus === "delivered" ? new Date(order.updatedAt) : undefined,
      notes: "Entrega generada por seed",
    });
  }

  return DeliveryOrder.countDocuments();
};

const seedTableBills = async (): Promise<number> => {
  const staff = await User.findOne({ role: "staff" });
  const customer = await User.findOne({ role: "customer" });
  const tables = await Table.find().sort({ number: 1 });
  const menuItems = await MenuItem.find().limit(10);

  ensure(staff, "No existe usuario staff. Ejecuta seed de users primero.");
  ensure(customer, "No existe usuario customer. Ejecuta seed de users primero.");
  ensure(tables.length >= 2, "Se requieren al menos 2 mesas. Ejecuta seed de tables primero.");
  ensure(menuItems.length >= 4, "Se requieren items de menu. Ejecuta seed de menu-items primero.");

  await TableBill.deleteMany({});
  await Table.updateMany({}, { status: "available", activeBill: null });

  const openBill = await TableBill.create({
    table: tables[0]._id,
    waiter: staff._id,
    customer: customer._id,
    items: pickOrderItems(menuItems as any, [0, 1]),
    status: "open",
    discount: 0,
  });

  const closedBill = await TableBill.create({
    table: tables[1]._id,
    waiter: staff._id,
    customer: customer._id,
    items: pickOrderItems(menuItems as any, [2, 3, 4]),
    status: "closed",
    paymentMethod: "cash",
    paidAt: new Date(Date.now() - 60 * 60 * 1000),
    discount: 50,
  });

  await Table.findByIdAndUpdate(tables[0]._id, {
    status: "occupied",
    activeBill: openBill._id,
  });

  await Table.findByIdAndUpdate(tables[1]._id, {
    status: "available",
    activeBill: null,
  });

  // Keep one additional table reserved for UI coverage
  if (tables[2]) {
    await Table.findByIdAndUpdate(tables[2]._id, { status: "reserved" });
  }

  void closedBill;
  return TableBill.countDocuments();
};

const seedCashRegisters = async (): Promise<number> => {
  const admin = await User.findOne({ role: "admin" });
  const staff = await User.findOne({ role: "staff" });

  ensure(admin && staff, "Se requieren usuarios admin/staff. Ejecuta seed de users primero.");

  await CashRegister.deleteMany({});

  const today = startOfDay();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  await CashRegister.create({
    date: yesterday,
    status: "closed",
    openingBalance: 20000,
    closingBalance: 26400,
    openedBy: staff._id,
    closedBy: admin._id,
    totalSales: 18400,
    totalCash: 6400,
    totalCard: 9000,
    totalTransfer: 3000,
    transactionCount: 18,
    notes: "Cierre seed dia anterior",
  });

  await CashRegister.create({
    date: today,
    status: "open",
    openingBalance: 25000,
    openedBy: staff._id,
    totalSales: 0,
    totalCash: 0,
    totalCard: 0,
    totalTransfer: 0,
    transactionCount: 0,
    notes: "Caja abierta por seed",
  });

  return CashRegister.countDocuments();
};

const collectionSeeders: Record<SeedCollection, () => Promise<number>> = {
  users: seedUsers,
  images: seedImages,
  "menu-items": seedMenuItems,
  tables: seedTables,
  "inventory-items": seedInventoryItems,
  contacts: seedContacts,
  "event-requests": seedEventRequests,
  reservations: seedReservations,
  orders: seedOrders,
  payments: seedPayments,
  transactions: seedTransactions,
  "delivery-orders": seedDeliveryOrders,
  "table-bills": seedTableBills,
  "cash-registers": seedCashRegisters,
};

const withDatabase = async (runner: () => Promise<void>): Promise<void> => {
  await connectDatabase();
  try {
    await runner();
  } finally {
    await mongoose.connection.close();
  }
};

export const runCollectionSeed = async (
  collection: SeedCollection,
): Promise<void> => {
  await withDatabase(async () => {
    const count = await collectionSeeders[collection]();
    console.log(`OK Seed ${collection}: ${count} documentos`);
  });
};

export const runAllCollectionSeeds = async (): Promise<void> => {
  await withDatabase(async () => {
    for (const collection of ALL_COLLECTIONS) {
      const count = await collectionSeeders[collection]();
      console.log(`OK Seed ${collection}: ${count} documentos`);
    }
  });
};

const isSeedCollection = (value: string): value is SeedCollection => {
  return (ALL_COLLECTIONS as string[]).includes(value);
};

if (require.main === module) {
  const requestedCollection = process.argv[2];

  if (!requestedCollection) {
    runAllCollectionSeeds()
      .then(() => {
        console.log("SEED Seed completo finalizado");
        process.exit(0);
      })
      .catch((error) => {
        console.error("ERROR Error ejecutando seed completo:", error);
        process.exit(1);
      });
  } else if (!isSeedCollection(requestedCollection)) {
    console.error(
      `ERROR Colección inválida: ${requestedCollection}. Válidas: ${ALL_COLLECTIONS.join(", ")}`,
    );
    process.exit(1);
  } else {
    runCollectionSeed(requestedCollection)
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        console.error(`ERROR Error ejecutando seed ${requestedCollection}:`, error);
        process.exit(1);
      });
  }
}
