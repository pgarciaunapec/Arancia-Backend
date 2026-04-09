import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { connectDatabase } from "../config/database";
import { MenuItem } from "../models/MenuItem";
import { Image } from "../models/Image";

const outPath = path.resolve(
  __dirname,
  "..",
  "..",
  "uploads",
  "missing-images.json",
);

const run = async () => {
  try {
    await connectDatabase();
    const items = await MenuItem.find({}, { name: 1, image: 1 }).lean();
    const missing: Array<{ name: string; image: string }> = [];

    const db = mongoose.connection.db;

    for (const it of items) {
      const img = it.image;
      if (!img) continue;
      if (!img.includes("/api/images/")) continue;
      const id = img.split("/").pop();
      if (!id || !mongoose.Types.ObjectId.isValid(id)) continue;

      const existsImage = await Image.findById(id).lean();
      if (existsImage) continue;

      const existsGrid = await db
        .collection("images.files")
        .findOne({ _id: new mongoose.Types.ObjectId(id) });
      if (existsGrid) continue;

      missing.push({ name: it.name, image: img });
    }

    fs.writeFileSync(outPath, JSON.stringify(missing, null, 2));
    console.log("Missing count:", missing.length, "wrote to", outPath);
  } catch (err) {
    console.error("Error finding missing images:", err);
    throw err;
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
