import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import { User } from "../models/User";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";
const ADMIN_NAME = "Administrador Arancia";

export const seedAdminUser = async (): Promise<void> => {
  try {
    await connectDatabase();

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.updateOne(
      { email: ADMIN_EMAIL.toLowerCase() },
      {
        $set: {
          name: ADMIN_NAME,
          email: ADMIN_EMAIL.toLowerCase(),
          password: passwordHash,
          role: "admin",
          isActive: true,
        },
      },
      { upsert: true },
    );

    console.log(`✅ Usuario admin listo: ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error("❌ Error creando usuario admin de pruebas:", error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("👋 Conexión cerrada");
  }
};

if (require.main === module) {
  seedAdminUser()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
