import mongoose from "mongoose";
import { MenuItem } from "../models/index";
import { connectDatabase } from "../config/database";

// Menu data from frontend (copied from src/data/menuData.ts)
const menuData = [
  // 🥤 Jugos Tropicales
  {
    name: "Agrio",
    category: "Jugos",
    price: 150,
    ingredients: ["Chinola", "limón", "naranja"],
    image: "/api/images/69b08f14369bf051156111be",
  },
  {
    name: "Piña",
    category: "Jugos",
    price: 120,
    ingredients: ["Piña fresca"],
    image: "/api/images/69b08f15369bf051156111c5",
  },
  {
    name: "Mangola",
    category: "Jugos",
    price: 160,
    ingredients: ["Mango", "chinola"],
    image: "/api/images/69b08f17369bf051156111cc",
  },
  {
    name: "Pasión Caribeña",
    category: "Jugos",
    price: 170,
    ingredients: ["Maracuyá", "frutas tropicales"],
    image: "/api/images/69b08f18369bf051156111d4",
  },
  {
    name: "Sonrisa Tropical",
    category: "Jugos",
    price: 180,
    ingredients: ["Frutas mixtas"],
    image: "/api/images/69b08f18369bf051156111dc",
  },
  {
    name: "Zapote",
    category: "Jugos",
    price: 140,
    ingredients: ["Zapote maduro"],
    image: "/api/images/69b08f19369bf051156111e4",
  },
  {
    name: "Fresa Tropical",
    category: "Jugos",
    price: 160,
    ingredients: ["Fresas", "leche condensada"],
    image: "/api/images/69b08f19369bf051156111ec",
  },
  {
    name: "Melón",
    category: "Jugos",
    price: 130,
    ingredients: ["Melón", "limón"],
    image: "/api/images/69b08f1a369bf051156111f4",
  },
  {
    name: "Granadilla",
    category: "Jugos",
    price: 170,
    ingredients: ["Granadilla", "miel"],
    image: "/api/images/69b08f1a369bf051156111fc",
  },
  {
    name: "Lechoza",
    category: "Jugos",
    price: 150,
    ingredients: ["Lechoza", "jengibre"],
    image: "/api/images/69b08f1a369bf05115611204",
  },
  {
    name: "Frechiza",
    category: "Jugos",
    price: 190,
    ingredients: ["Fresa", "higo", "zarzamora"],
    image: "/api/images/69b08f1b369bf0511561120c",
  },
  {
    name: "Combinación Tropical",
    category: "Jugos",
    price: 200,
    ingredients: ["Variedad de frutas tropicales"],
    image: "/api/images/69b08f1b369bf05115611214",
  },

  // 🍹 Cócteles Tropicales
  {
    name: "Vodka Tropical",
    category: "Cócteles",
    price: 350,
    ingredients: ["Vodka", "jugos tropicales", "hielo"],
    image: "/api/images/69b08f1b369bf0511561121c",
  },
  {
    name: "Copa de Sangría",
    category: "Cócteles",
    price: 300,
    ingredients: ["Vino tinto", "frutas", "azúcar"],
    image: "/api/images/69b08f1c369bf05115611223",
  },
  {
    name: "Trabucazo",
    category: "Cócteles",
    price: 380,
    ingredients: ["Ron", "licores variados", "frutas"],
    image: "/api/images/69b08f1c369bf0511561122a",
  },
  {
    name: "Néctar Caribe",
    category: "Cócteles",
    price: 320,
    ingredients: ["Ron", "coco", "piña"],
    image: "/api/images/69b08f1d369bf05115611232",
  },
  {
    name: "Piña Colada Tropical",
    category: "Cócteles",
    price: 340,
    ingredients: ["Ron", "crema de coco", "piña"],
    image: "/api/images/69b08f1d369bf05115611232",
  },
  {
    name: "Margarita",
    category: "Cócteles",
    price: 310,
    ingredients: ["Tequila", "licor de naranja", "limón"],
    image: "/api/images/69b08f1d369bf0511561123a",
  },
  {
    name: "Suave Diferencia",
    category: "Cócteles",
    price: 360,
    ingredients: ["Whiskey", "licor de durazno", "limón"],
    image: "/api/images/69b08f1d369bf0511561123c",
  },
  {
    name: "Amor de Verano",
    category: "Cócteles",
    price: 330,
    ingredients: ["Vodka", "licor de fresa", "limón"],
    image: "/api/images/69b08f1d369bf05115611244",
  },
  {
    name: "Licor Tropical",
    category: "Cócteles",
    price: 280,
    ingredients: ["Licor de frutas tropicales"],
    image: "/api/images/69b08f1d369bf05115611244",
  },

  // 🍽️ Entradas / Aperitivos
  {
    name: "Croquetas de Pollo",
    category: "Entradas",
    price: 220,
    ingredients: ["Pollo desmenuzado", "pan rallado", "especias"],
    image: "/api/images/69b08f1e369bf0511561124b",
  },
  {
    name: "Salchichas a la Parrilla",
    category: "Entradas",
    price: 250,
    ingredients: ["Salchichas premium", "salsa especial"],
    image: "/api/images/69b08f1e369bf05115611252",
  },
  {
    name: "Medio Sabrococho",
    category: "Entradas",
    price: 180,
    ingredients: ["Sopa tradicional dominicana"],
    image: "/api/images/69b08f1e369bf05115611259",
  },
  {
    name: "Arepa rellena",
    category: "Entradas",
    price: 120,
    ingredients: ["Harina de maíz", "queso", "aceite"],
    image: "/api/images/69b08f1e369bf05115611261",
  },
  {
    name: "Cóctel de Camarones",
    category: "Entradas",
    price: 380,
    ingredients: ["Camarones frescos", "cóctel de mariscos"],
    image: "/api/images/69b08f1f369bf05115611269",
  },
  {
    name: "Palitos del Mar",
    category: "Entradas",
    price: 280,
    ingredients: ["Pescado empanizado", "salsa tártara"],
    image: "/api/images/69b08f1f369bf05115611271",
  },
  {
    name: "Bolitas de Pescado",
    category: "Entradas",
    price: 260,
    ingredients: ["Pescado molido", "especias", "harina"],
    image: "/api/images/69b08f20369bf05115611278",
  },
  {
    name: "Ceviche Tropical",
    category: "Entradas",
    price: 320,
    ingredients: ["Pescado blanco", "limón", "cebolla morada", "cilantro"],
    image: "/api/images/69b08f21369bf05115611281",
  },
  {
    name: "Salpicón de Chicharrón",
    category: "Entradas",
    price: 290,
    ingredients: ["Chicharrón de cerdo", "verduras", "salsa"],
    image: "/api/images/69b08f21369bf05115611289",
  },
  {
    name: "Catibías",
    category: "Entradas",
    price: 240,
    ingredients: ["Masa de maíz", "relleno de cerdo/queso/Angus"],
    image: "/api/images/69b08f21369bf0511561128b",
  },
  {
    name: "Quipe Árabe",
    category: "Entradas",
    price: 230,
    ingredients: ["Carne molida", "especias árabes", "pan plano"],
    image: "/api/images/69b08f22369bf05115611293",
  },

  // 🍲 Sopas y Caldos
  {
    name: "Sabrococho",
    category: "Sopas",
    price: 200,
    ingredients: ["Carne de res", "yuca", "plátano", "maíz"],
    image: "/api/images/69b08f22369bf0511561129b",
  },
  {
    name: "Cocido",
    category: "Sopas",
    price: 220,
    ingredients: ["Carne de res", "verduras", "frijoles"],
    image: "/api/images/69b08f23369bf051156112a3",
  },
  {
    name: "Mondongo",
    category: "Sopas",
    price: 250,
    ingredients: ["Mondongo", "verduras", "yuca"],
    image: "/api/images/69b08f23369bf051156112ab",
  },
  {
    name: "Sopa de Pollo",
    category: "Sopas",
    price: 180,
    ingredients: ["Pollo", "fideos", "zanahoria", "apio"],
    image: "/api/images/69b08f23369bf051156112b3",
  },
  {
    name: "Sopa del Mar",
    category: "Sopas",
    price: 320,
    ingredients: ["Mariscos variados", "caldo de pescado"],
    image: "/api/images/69b08f24369bf051156112bb",
  },

  // 🍗 Fritos & Mofongos
  {
    name: "Mini Mofongo",
    category: "Fritos",
    price: 180,
    ingredients: ["Plátanos verdes", "cerdo", "caldo"],
    image: "/api/images/69b08f24369bf051156112c4",
  },
  {
    name: "Mofongo",
    category: "Fritos",
    price: 280,
    ingredients: ["Plátanos verdes", "carne", "caldo"],
    image: "/api/images/69b08f25369bf051156112cd",
  },
  {
    name: "Mofongo Combi",
    category: "Fritos",
    price: 320,
    ingredients: ["Plátanos verdes", "combinación de carnes"],
    image: "/api/images/69b08f25369bf051156112d6",
  },
  {
    name: "Res Frita",
    category: "Fritos",
    price: 350,
    ingredients: ["Carne de res frita", "tajadas", "ensalada"],
    image: "/api/images/69b08f26369bf051156112df",
  },
  {
    name: "Cerdo Frito",
    category: "Fritos",
    price: 320,
    ingredients: ["Cerdo frito", "tajadas", "ensalada"],
    image: "/api/images/69b08f26369bf051156112e7",
  },
  {
    name: "Longaniza",
    category: "Fritos",
    price: 280,
    ingredients: ["Longaniza dominicana", "tajadas"],
    image: "/api/images/69b08f26369bf051156112ef",
  },
  {
    name: "Fritura Combi",
    category: "Fritos",
    price: 380,
    ingredients: ["Combinación de carnes fritas"],
    image: "/api/images/69b08f27369bf051156112f8",
  },
  {
    name: "Chichapollito",
    category: "Fritos",
    price: 260,
    ingredients: ["Pollo frito", "chicharrón"],
    image: "/api/images/69b08f28369bf05115611302",
  },

  // 🍔 Sandwiches & Parrilladas
  {
    name: "Club",
    category: "Sandwiches",
    price: 320,
    ingredients: ["Pan tostado", "pollo", "tocino", "lechuga", "tomate"],
    image: "/api/images/69b08f28369bf0511561130c",
  },
  {
    name: "Hamburger",
    category: "Sandwiches",
    price: 280,
    ingredients: [
      "Carne de res",
      "queso",
      "lechuga",
      "tomate",
      "pan artesanal",
    ],
    image: "/api/images/69b08f29369bf05115611315",
  },
  {
    name: "Pollo",
    category: "Sandwiches",
    price: 260,
    ingredients: ["Pechuga de pollo", "lechuga", "tomate", "mayonesa"],
    image: "/api/images/69b08f2a369bf0511561131e",
  },
  {
    name: "Solomo",
    category: "Sandwiches",
    price: 380,
    ingredients: ["Solomillo de res", "queso", "cebolla caramelizada"],
    image: "/api/images/69b08f2a369bf05115611327",
  },
  {
    name: "Filete de Res",
    category: "Sandwiches",
    price: 420,
    ingredients: ["Filete de res", "hongos", "cebolla", "mostaza"],
    image: "/api/images/69b08f2b369bf05115611330",
  },
  {
    name: "Parrillada Adrián",
    category: "Sandwiches",
    price: 450,
    ingredients: ["Selección de carnes a la parrilla"],
    image: "/api/images/69b08f2c369bf05115611339",
  },

  // 🍗 Carnes Asadas / Grill
  {
    name: "Pollo Asado",
    category: "Carnes Asadas",
    price: 400,
    ingredients: ["Pollo entero", "adobo tropical", "guarnición"],
    image: "/api/images/69b08f2c369bf05115611343",
  },
  {
    name: "Chuletas de Cerdo",
    category: "Carnes Asadas",
    price: 380,
    ingredients: ["Chuletas de cerdo", "salsa especial"],
    image: "/api/images/69b08f2d369bf0511561134d",
  },
  {
    name: "Pechuga a la Cordon Bleu",
    category: "Carnes Asadas",
    price: 420,
    ingredients: ["Pechuga de pollo", "jamón", "queso", "pan rallado"],
    image: "/api/images/69b08f2e369bf05115611356",
  },
  {
    name: "Pechuga de Pollo",
    category: "Carnes Asadas",
    price: 350,
    ingredients: ["Pechuga de pollo a la parrilla"],
    image: "/api/images/69b08f2e369bf05115611356",
  },
  {
    name: "Filetillo de Cerdo",
    category: "Carnes Asadas",
    price: 400,
    ingredients: ["Filete de cerdo tierno"],
    image: "/api/images/69b08f2e369bf0511561135f",
  },
  {
    name: "Costillas de Cerdo",
    category: "Carnes Asadas",
    price: 480,
    ingredients: ["Costillas BBQ", "salsa ahumada"],
    image: "/api/images/69b08f2e369bf0511561135f",
  },

  // 🍛 Criollos y Arroces
  {
    name: "Asopao de Pollo",
    category: "Criollos",
    price: 280,
    ingredients: ["Arroz", "pollo", "verduras", "caldo"],
    image: "/api/images/69b08f2f369bf05115611367",
  },
  {
    name: "Arroz con Pollo",
    category: "Criollos",
    price: 260,
    ingredients: ["Arroz dorado", "pollo", "habichuelas rojas"],
    image: "/api/images/69b08f30369bf0511561136f",
  },
  {
    name: "Bacalao",
    category: "Criollos",
    price: 320,
    ingredients: ["Bacalao desalado", "ñames", "pimientos"],
    image: "/api/images/69b08f30369bf05115611377",
  },
  {
    name: "Arenque",
    category: "Criollos",
    price: 300,
    ingredients: ["Arenque en escabeche", "plátano", "cebolla"],
    image: "/api/images/69b08f31369bf0511561137f",
  },
  {
    name: "Chivo Guisado",
    category: "Criollos",
    price: 420,
    ingredients: ["Cabrito guisado", "verduras", "especias"],
    image: "/api/images/69b08f31369bf05115611387",
  },
  {
    name: "Chowfan",
    category: "Criollos",
    price: 350,
    ingredients: ["Arroz frito", "verduras", "carne/pollo"],
    image: "/api/images/69b08f32369bf0511561138f",
  },
  {
    name: "Bistec de Filete",
    category: "Criollos",
    price: 450,
    ingredients: ["Filete de res", "cebollas", "pimientos"],
    image: "/api/images/69b08f32369bf05115611398",
  },

  // 🥗 Ensaladas
  {
    name: "Constanza",
    category: "Ensaladas",
    price: 220,
    ingredients: ["Lechuga", "tomate", "cebolla", "atún", "huevo"],
    image: "/api/images/69b08f33369bf051156113a0",
  },
  {
    name: "San Juan",
    category: "Ensaladas",
    price: 240,
    ingredients: ["Mix de hojas", "frutos secos", "vinagreta especial"],
    image: "/api/images/69b08f34369bf051156113ae",
  },

  // 🍝 Pastas
  {
    name: "Espaguetis al Gusto",
    category: "Pastas",
    price: 280,
    ingredients: ["Espaguetis", "salsa de tomate", "carne molida"],
    image: "/api/images/69b08f36369bf051156113c0",
  },
  {
    name: "Espaguetis con Mariscos",
    category: "Pastas",
    price: 320,
    ingredients: ["Espaguetis", "mariscos", "salsa blanca"],
    image: "/api/images/69b08f36369bf051156113c7",
  },
  {
    name: "Canelones Rellenos",
    category: "Pastas",
    price: 350,
    ingredients: ["Canelones", "carne molida", "bechamel", "queso"],
    image: "/api/images/69b08f37369bf051156113cc",
  },

  // 🦐 Rincón Marino (Mariscos & Pescados)
  {
    name: "Camarofongo",
    category: "Rincón Marino",
    price: 480,
    ingredients: ["Camarones", "mofongo", "salsa de camarones"],
    image: "/api/images/69b08f38369bf051156113d8",
  },
  {
    name: "Mini Camarofongo",
    category: "Rincón Marino",
    price: 320,
    ingredients: ["Porción menor de camarofongo"],
    image: "/api/images/69b08f38369bf051156113d8",
  },
  {
    name: "Pescado Boca Chica",
    category: "Rincón Marino",
    price: 520,
    ingredients: ["Pescado fresco Boca Chica", "limón", "especias"],
    image: "/api/images/69b08f39369bf051156113e8",
  },
  {
    name: "Pescado Samaná",
    category: "Rincón Marino",
    price: 550,
    ingredients: ["Pescado Samaná", "mojo criollo", "tajadas"],
    image: "/api/images/69b08f3a369bf051156113f3",
  },
  {
    name: "Espaguetis Rincón Marino",
    category: "Rincón Marino",
    price: 380,
    ingredients: ["Espaguetis con mariscos", "salsa marinera"],
    image: "/api/images/69b08f36369bf051156113c7",
  },
  {
    name: "Espaguetis con Camarones",
    category: "Rincón Marino",
    price: 420,
    ingredients: ["Espaguetis", "camarones", "salsa de ajo"],
    image: "/api/images/69b08f3b369bf05115611403",
  },
  {
    name: "Arroz con Camarones",
    category: "Rincón Marino",
    price: 400,
    ingredients: ["Arroz", "camarones", "salsa especial"],
    image: "/api/images/69b08f3c369bf0511561141b",
  },
  {
    name: "Asopao de Camarones",
    category: "Rincón Marino",
    price: 450,
    ingredients: ["Arroz", "camarones", "caldo de mariscos"],
    image: "/api/images/69b08f3c369bf05115611420",
  },
  {
    name: "Arroz Rincón Marino",
    category: "Rincón Marino",
    price: 380,
    ingredients: ["Arroz con mariscos variados"],
    image: "/api/images/69b08f3c369bf05115611420",
  },
  {
    name: "Salpicón de Mariscos",
    category: "Rincón Marino",
    price: 480,
    ingredients: ["Mezcla de mariscos", "salsa especial"],
    image: "/api/images/69b08f3d369bf0511561142c",
  },

  // 🍰 Postres
  {
    name: "Pudin de Pan",
    category: "Postres",
    price: 150,
    ingredients: ["Pan viejo", "leche", "huevos", "azúcar"],
    image: "/api/images/69b08f3e369bf05115611438",
  },
  {
    name: "Flan de Leche",
    category: "Postres",
    price: 160,
    ingredients: ["Leche", "huevos", "caramelo"],
    image: "/api/images/69b08f3e369bf05115611442",
  },
  {
    name: "Ensalada de Frutas",
    category: "Postres",
    price: 140,
    ingredients: ["Frutas de temporada", "leche condensada"],
    image: "/api/images/69b08f3e369bf0511561144a",
  },
  {
    name: "Sorbete",
    category: "Postres",
    price: 120,
    ingredients: ["Frutas naturales", "hielo"],
    image: "/api/images/69b08f40369bf0511561145e",
  },
  {
    name: "Leche Cortada",
    category: "Postres",
    price: 130,
    ingredients: ["Leche", "limón", "canela"],
    image: "/api/images/69b08f41369bf05115611470",
  },
  {
    name: "Frutas en Almíbar",
    category: "Postres",
    price: 170,
    ingredients: ["Frutas confitadas", "almíbar"],
    image: "/api/images/69b08f41369bf05115611476",
  },
  {
    name: "Tres Leches",
    category: "Postres",
    price: 190,
    ingredients: ["Bizcocho", "tres tipos de leche", "merengue"],
    image: "/api/images/69b08f42369bf05115611482",
  },
];

export const seedMenu = async () => {
  try {
    await connectDatabase();

    console.log("🗑️ Eliminando datos existentes del menú...");
    await MenuItem.deleteMany({});

    console.log("📝 Insertando datos del menú...");
    const items = menuData.map((item) => ({
      ...item,
      available: true,
    }));

    await MenuItem.insertMany(items);

    console.log(`✅ ${items.length} items del menú creados exitosamente`);

    // Show categories summary
    const categories = await MenuItem.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    console.log("\n📊 Resumen por categoría:");
    categories.forEach((cat) => {
      console.log(`   ${cat._id}: ${cat.count} items`);
    });
  } catch (error) {
    console.error("❌ Error en seed:", error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Conexión cerrada");
  }
};

if (require.main === module) {
  seedMenu()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
