import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Payment } from "../models/Payment";

export class PaymentService {
  static async generateReference(): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    const reference = `ARN-${date}-${random}`;

    // Ensure uniqueness
    const existing = await Payment.findOne({ reference });
    if (existing) {
      return PaymentService.generateReference();
    }
    return reference;
  }

  static async hashCardNumber(cardNumber: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(cardNumber, salt);
  }

  static getLast4Digits(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, "");
    return cleaned.slice(-4);
  }

  static validatePaymentMethod(method: string): boolean {
    return ["cash", "card", "transfer"].includes(method);
  }
}
