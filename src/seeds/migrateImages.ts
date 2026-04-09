import mongoose from "mongoose";
import axios from "axios";
import { connectDatabase } from "../config/database";
import { MenuItem } from "../models/MenuItem";
import { Image } from "../models/Image";

const downloadImage = async (
  url: string,
): Promise<{ buffer: Buffer; contentType: string } | null> => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return {
      buffer: Buffer.from(response.data),
      contentType: response.headers["content-type"],
    };
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    return null;
  }
};

export const migrateImages = async () => {
  try {
    await connectDatabase();
    console.log("Connected to database for migration...");

    const menuItems = await MenuItem.find({});
    console.log(`Found ${menuItems.length} menu items to process.`);

    for (const item of menuItems) {
      if (
        item.image &&
        item.image.startsWith("http") &&
        !item.image.includes("/api/images/")
      ) {
        console.log(`Processing image for: ${item.name}`);

        const imageData = await downloadImage(item.image);

        if (imageData) {
          const newImage = await Image.create({
            filename: `${item._id}_image`,
            contentType: imageData.contentType,
            data: imageData.buffer,
          });

          item.image = `/api/images/${newImage._id}`;
          await item.save();
          console.log(
            `Updated image for ${item.name} -> /api/images/${newImage._id}`,
          );
        } else {
          console.log(`Skipping ${item.name} due to download error.`);
        }
      } else {
        console.log(`Skipping ${item.name} (already migrated or invalid URL)`);
      }
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

if (require.main === module) {
  migrateImages()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
