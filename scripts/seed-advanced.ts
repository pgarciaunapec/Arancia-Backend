/**
 * Advanced Seed Script
 * Populate inventory with realistic data and relationships
 */

import mongoose from 'mongoose';
import { User } from '../models/User';
import { MenuItem } from '../models/MenuItem';
import { Table } from '../models/Table';
import { Vehicle } from '../models/Vehicle';
import { InventoryMovement } from '../models/InventoryMovement';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant';

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seeding de base de datos...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones existentes (opcionalmente)
    // await User.deleteMany({});
    // await MenuItem.deleteMany({});
    // await Table.deleteMany({});
    // await Vehicle.deleteMany({});

    // 1. Crear usuarios de prueba
    console.log('\n📋 Creando usuarios...');
    const adminUser = await User.create({
      name: 'Admin Restaurant',
      email: 'admin@arancia.com',
      password: 'Admin123!',
      phone: '+1 (829) 123-4567',
      role: 'admin',
      isActive: true,
    });
    console.log(`✓ Admin creado: ${adminUser.email}`);

    const staffUser = await User.create({
      name: 'Chef Principal',
      email: 'chef@arancia.com',
      password: 'Chef123!',
      phone: '+1 (829) 234-5678',
      role: 'staff',
      isActive: true,
    });
    console.log(`✓ Staff creado: ${staffUser.email}`);

    // 2. Crear menú items con imágenes locales (URLs relativas)
    console.log('\n🍽️ Creando menú items...');
    const menuItems = await MenuItem.insertMany([
      {
        name: 'Ensalada Fresca',
        category: 'Ensaladas',
        price: 250,
        ingredients: ['lechuga', 'tomate', 'cebolla', 'queso'],
        description: 'Ensalada mixta fresca con aderezos caseros',
        image: '/images/ensalada.jpg',
        available: true,
      },
      {
        name: 'Pechuga a la Parrilla',
        category: 'Platos Principales',
        price: 450,
        ingredients: ['pechuga de pollo', 'limón', 'ajo', 'sal'],
        description: 'Pechuga jugosa asada a la parrilla',
        image: '/images/pechuga.jpg',
        available: true,
      },
      {
        name: 'Filete Mignon',
        category: 'Platos Principales',
        price: 650,
        ingredients: ['filete mignon', 'champiñones', 'salsa de vino'],
        description: 'Corte premium de carnes',
        image: '/images/filete.jpg',
        available: true,
      },
      {
        name: 'Camarones Ajillo',
        category: 'Mariscos',
        price: 550,
        ingredients: ['camarones', 'ajo', 'aceite de oliva', 'perejil'],
        description: 'Camarones frescos en salsa de ajo',
        image: '/images/camarones.jpg',
        available: true,
      },
      {
        name: 'Postre Chocolate',
        category: 'Postres',
        price: 180,
        ingredients: ['chocolate', 'crema', 'vainilla'],
        description: 'Mousse de chocolate gourmet',
        image: '/images/chocolate.jpg',
        available: true,
      },
      {
        name: 'Bebida Especial',
        category: 'Bebidas',
        price: 120,
        ingredients: ['jugo de frutas', 'hielo', 'miel'],
        description: 'Bebida refrescante de la casa',
        image: '/images/bebida.jpg',
        available: true,
      },
    ]);
    console.log(`✓ ${menuItems.length} items de menú creados`);

    // 3. Crear mesas
    console.log('\n🪑 Creando mesas...');
    const tables = await Table.insertMany([
      { number: 1, capacity: 2, section: 'Entrada', status: 'available', image: '/images/mesa-2.jpg' },
      { number: 2, capacity: 2, section: 'Entrada', status: 'available' },
      { number: 3, capacity: 4, section: 'Centro', status: 'available' },
      { number: 4, capacity: 4, section: 'Centro', status: 'available' },
      { number: 5, capacity: 6, section: 'Fondo', status: 'available' },
      { number: 6, capacity: 8, section: 'Fondo', status: 'available', description: 'Mesa grande para grupos' },
    ]);
    console.log(`✓ ${tables.length} mesas creadas`);

    // 4. Crear flota de vehículos
    console.log('\n🚗 Creando flota de vehículos...');
    const vehicles = await Vehicle.insertMany([
      {
        plate: 'RD-001-ABC',
        type: 'motorcycle',
        vehicleModel: 'Honda 150cc',
        capacityOrders: 3,
        status: 'available',
        notes: 'Moto de entrega rápida',
      },
      {
        plate: 'RD-002-DEF',
        type: 'motorcycle',
        vehicleModel: 'Yamaha 150cc',
        capacityOrders: 3,
        status: 'available',
      },
      {
        plate: 'RD-003-GHI',
        type: 'car',
        vehicleModel: 'Toyota Corolla',
        capacityOrders: 8,
        status: 'available',
        notes: 'Vehículo para eventos',
      },
      {
        plate: 'RD-004-JKL',
        type: 'van',
        vehicleModel: 'Hyundai H100',
        capacityOrders: 12,
        status: 'available',
        notes: 'Van para catering',
      },
    ]);
    console.log(`✓ ${vehicles.length} vehículos creados`);

    // 5. Crear movimientos de inventario iniciales
    console.log('\n📦 Creando movimientos de inventario...');
    const movements = await InventoryMovement.insertMany([
      {
        type: 'restock',
        itemName: 'Pechuga de Pollo',
        quantity: 50,
        unit: 'kg',
        reason: 'Compra inicial',
        performedBy: staffUser._id,
        reference: 'INV-001',
      },
      {
        type: 'restock',
        itemName: 'Camarones Frescos',
        quantity: 30,
        unit: 'kg',
        reason: 'Compra a proveedor marino',
        performedBy: staffUser._id,
        reference: 'INV-002',
      },
      {
        type: 'restock',
        itemName: 'Lechuga',
        quantity: 20,
        unit: 'kg',
        reason: 'Compra a granja local',
        performedBy: staffUser._id,
        reference: 'INV-003',
      },
      {
        type: 'consumption',
        itemName: 'Pechuga de Pollo',
        quantity: 5,
        unit: 'kg',
        reason: 'Consumo Pedido #001',
        performedBy: staffUser._id,
        reference: 'ORD-001',
      },
    ]);
    console.log(`✓ ${movements.length} movimientos de inventario creados`);

    console.log('\n🎉 Seeding completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`  • Usuarios: ${(await User.countDocuments())}`);
    console.log(`  • Items de Menú: ${(await MenuItem.countDocuments())}`);
    console.log(`  • Mesas: ${(await Table.countDocuments())}`);
    console.log(`  • Vehículos: ${(await Vehicle.countDocuments())}`);
    console.log(`  • Movimientos de Inventario: ${(await InventoryMovement.countDocuments())}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
