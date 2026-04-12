import crypto from "crypto";
import QRCode from "qrcode";
import { Invoice } from "../models/Invoice";

const isValidPaymentMethod = (
  value: unknown,
): value is "cash" | "card" | "transfer" =>
  value === "cash" || value === "card" || value === "transfer";

export class InvoiceService {
  private static async generateCode(prefix: "INV" | "TBL"): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    const code = `${prefix}-${date}-${random}`;

    const existing = await Invoice.findOne({ code }).select("_id").lean();
    if (existing) {
      return this.generateCode(prefix);
    }

    return code;
  }

  private static async buildQr(
    payload: Record<string, unknown>,
  ): Promise<{ qrPayload: string; qrImageDataUrl: string }> {
    const qrPayload = JSON.stringify(payload);
    const qrImageDataUrl = await QRCode.toDataURL(qrPayload, {
      margin: 1,
      width: 240,
      errorCorrectionLevel: "M",
    });

    return { qrPayload, qrImageDataUrl };
  }

  static async createFromOrderPayment(order: any, payment: any) {
    const existing = await Invoice.findOne({ order: order._id });
    if (existing) {
      return existing;
    }

    const code = await this.generateCode("INV");
    const issuedAt = new Date();

    const { qrPayload, qrImageDataUrl } = await this.buildQr({
      code,
      kind: "order",
      orderId: String(order._id),
      userId: String(order.user),
      total: Number(order.total || 0),
      currency: "DOP",
      issuedAt: issuedAt.toISOString(),
    });

    return Invoice.create({
      code,
      kind: "order",
      order: order._id,
      user: order.user,
      payment: payment?._id,
      paymentMethod: isValidPaymentMethod(payment?.method)
        ? payment.method
        : undefined,
      subtotal: Number(order.subtotal || 0),
      tax: Number(order.tax || 0),
      discount: 0,
      total: Number(order.total || 0),
      currency: "DOP",
      qrPayload,
      qrImageDataUrl,
      issuedAt,
      metadata: {
        paymentReference: payment?.reference,
      },
    });
  }

  static async createFromTableBill(tableBill: any, paymentMethod?: unknown) {
    const existing = await Invoice.findOne({ tableBill: tableBill._id });
    if (existing) {
      return existing;
    }

    const code = await this.generateCode("TBL");
    const issuedAt = new Date();

    const { qrPayload, qrImageDataUrl } = await this.buildQr({
      code,
      kind: "table_bill",
      tableBillId: String(tableBill._id),
      total: Number(tableBill.total || 0),
      currency: "DOP",
      issuedAt: issuedAt.toISOString(),
    });

    return Invoice.create({
      code,
      kind: "table_bill",
      tableBill: tableBill._id,
      user: tableBill.customer || undefined,
      paymentMethod: isValidPaymentMethod(paymentMethod)
        ? paymentMethod
        : undefined,
      subtotal: Number(tableBill.subtotal || 0),
      tax: Number(tableBill.tax || 0),
      discount: Number(tableBill.discount || 0),
      total: Number(tableBill.total || 0),
      currency: "DOP",
      qrPayload,
      qrImageDataUrl,
      issuedAt,
      metadata: {
        table: tableBill.table,
      },
    });
  }
}
