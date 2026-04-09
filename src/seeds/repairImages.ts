import mongoose from "mongoose";
import axios from "axios";
import fs from "fs";
import path from "path";
import { connectDatabase } from "../config/database";
import { MenuItem } from "../models/MenuItem";
import { Image } from "../models/Image";

const mappingPath = path.resolve(
  __dirname,
  "..",
  "..",
  "uploads",
  "image-mapping.json",
);

const downloadImage = async (
  url: string,
): Promise<{ buffer: Buffer; contentType: string } | null> => {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 30000,
    });
    return {
      buffer: Buffer.from(res.data),
      contentType: res.headers["content-type"] || "application/octet-stream",
    };
  } catch (err) {
    console.error("Download failed for", url, err?.message || err);
    return null;
  }
};

const repair = async () => {
  try {
    await connectDatabase();

    const mapping = fs.existsSync(mappingPath)
      ? JSON.parse(fs.readFileSync(mappingPath, "utf8"))
      : {};

    const items = await MenuItem.find({});
    console.log("Found", items.length, "menu items");

    for (const item of items) {
      if (!item.image) continue;

      // If already a remote URL (not our API), skip here (migrateImages will handle)
      if (
        item.image.startsWith("http") &&
        !item.image.includes("/api/images/")
      ) {
        console.log(
          `Skipping external URL for ${item.name}: will migrate separately`,
        );
        continue;
      }

      const parts = item.image.split("/");
      const imageId = parts[parts.length - 1];

      if (!imageId || !mongoose.Types.ObjectId.isValid(imageId)) {
        console.warn(`Item ${item.name} has non-objectid image: ${item.image}`);
        continue;
      }

      const exists = await Image.findById(imageId);
      if (exists) {
        // ok
        continue;
      }

      // check GridFS
      const db = mongoose.connection.db;
      const gridfs = await db
        .collection("images.files")
        .findOne({ _id: new mongoose.Types.ObjectId(imageId) });
      if (gridfs) continue;

      // attempt to find original URL from mapping
      const mappingEntry = Object.entries(mapping).find(
        ([_url, id]) => id === imageId,
      );
      if (!mappingEntry) {
        console.warn(
          `No mapping found for image id ${imageId} (item ${item.name})`,
        );
        continue;
      }

      const [origUrl] = mappingEntry;
      console.log(`Repairing ${item.name} from ${origUrl}`);
      const img = await downloadImage(origUrl);
      if (!img) {
        console.error(`Failed to download ${origUrl} for item ${item.name}`);
        continue;
      }

      try {
        const objId = new mongoose.Types.ObjectId(imageId);
        const newDoc = new Image({
          _id: objId,
          filename: `${item._id}_repair`,
          contentType: img.contentType,
          data: img.buffer,
        });
        await newDoc.save();
        console.log(`Created Image doc _id=${imageId} for item ${item.name}`);
      } catch (err) {
        console.error("Error creating Image document for", imageId, err);
      }
    }

    console.log("Repair finished");
  } catch (err) {
    console.error("Repair failed:", err);
    throw err;
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed");
  }
};

if (require.main === module) {
  repair()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
