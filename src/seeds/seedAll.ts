import { seedMenu } from "./menuSeed";
import { migrateImages } from "./migrateImages";

const runAll = async () => {
  try {
    console.log("🔁 Ejecutando seed completo: menu -> migrar imágenes");

    await seedMenu();
    console.log("✅ Menu seed completado");

    await migrateImages();
    console.log("✅ Migración de imágenes completada");

    console.log("🎉 Seed completo terminado");
    process.exit(0);
  } catch (err) {
    console.error("❌ SeedAll falló:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  runAll();
}
