import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import { Image } from "../models/Image";
import { MenuItem } from "../models/MenuItem";

const diagImages = async () => {
  try {
    await connectDatabase();
    console.log("\n--- DIAGNÓSTICO DE IMÁGENES ---\n");

    // 1. Cuántos documentos hay en el modelo Image (colección `images`)
    const imageCount = await Image.countDocuments();
    console.log(
      `Documentos en colección 'images' (modelo Image): ${imageCount}`,
    );

    if (imageCount > 0) {
      const firstImage = await Image.findOne(
        {},
        { _id: 1, filename: 1, contentType: 1 },
      );
      console.log(`Ejemplo de imagen en colección 'images':`, firstImage);
    }

    // 2. Cuántos documentos hay en GridFS (images.files)
    const db = mongoose.connection.db;
    if (!db) {
      console.error("MongoDB connection DB is not available");
      process.exit(1);
    }
    const gridfsCount = await db.collection("images.files").countDocuments();
    console.log(
      `\nDocumentos en colección 'images.files' (GridFS): ${gridfsCount}`,
    );

    if (gridfsCount > 0) {
      const firstGridFS = await db
        .collection("images.files")
        .findOne({}, { projection: { _id: 1, filename: 1, contentType: 1 } });
      console.log(`Ejemplo de imagen en GridFS:`, firstGridFS);
    }

    // 3. Qué formato tienen las imágenes en MenuItem
    const menuItems = await MenuItem.find({}, { name: 1, image: 1 }).limit(5);
    console.log("\nEjemplos de campo `image` en MenuItems:");
    menuItems.forEach((item) => {
      console.log(`  - ${item.name}: ${item.image}`);
    });

    // 4. Verificar si alguno de esos IDs existe en la colección images
    console.log(
      "\nVerificando si los IDs del menú existen en la colección images...",
    );
    for (const item of menuItems) {
      const imageId = item.image.split("/").pop();
      if (imageId && mongoose.Types.ObjectId.isValid(imageId)) {
        const exists = await Image.findById(imageId);
        console.log(
          `  ${item.name} -> ID ${imageId}: ${exists ? "✅ EXISTE en images" : "❌ NO existe en images"}`,
        );

        // Check in GridFS too
        const existsGridFS = await db
          .collection("images.files")
          .findOne({ _id: new mongoose.Types.ObjectId(imageId) });
        console.log(
          `  ${item.name} -> ID ${imageId}: ${existsGridFS ? "✅ EXISTE en GridFS" : "❌ NO existe en GridFS"}`,
        );
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

diagImages();
