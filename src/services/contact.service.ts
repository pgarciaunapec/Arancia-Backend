/**
 * Contact Service
 * Handles contact form submissions and inquiries
 */

import { Contact } from "../models/Contact";
import { CreateContactRequestDTO, ContactResponseDTO } from "../dtos/index";

export class ContactService {
  /**
   * Create a new contact message
   */
  static async create(
    dto: CreateContactRequestDTO,
  ): Promise<ContactResponseDTO> {
    const contact = await Contact.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      subject: dto.subject,
      message: dto.message,
      status: "new",
    });

    return this.mapToResponseDTO(contact);
  }

  /**
   * Get contact message by ID
   */
  static async getById(id: string): Promise<ContactResponseDTO> {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw new Error("Mensaje de contacto no encontrado");
    }
    return this.mapToResponseDTO(contact);
  }

  /**
   * Get all contact messages (admin)
   */
  static async getAll(
    skip: number = 0,
    limit: number = 10,
    status?: string,
  ): Promise<{
    data: ContactResponseDTO[];
    total: number;
  }> {
    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const total = await Contact.countDocuments(filter);
    const messages = await Contact.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      data: messages.map((msg) => this.mapToResponseDTO(msg)),
      total,
    };
  }

  /**
   * Update contact message status
   */
  static async updateStatus(
    id: string,
    status: string,
  ): Promise<ContactResponseDTO> {
    const validStatuses = ["new", "read", "responded", "closed"];
    if (!validStatuses.includes(status)) {
      throw new Error("Estado inválido");
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!contact) {
      throw new Error("Mensaje de contacto no encontrado");
    }

    return this.mapToResponseDTO(contact);
  }

  /**
   * Delete a contact message
   */
  static async delete(id: string): Promise<void> {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      throw new Error("Mensaje de contacto no encontrado");
    }
  }

  /**
   * Map to response DTO
   */
  private static mapToResponseDTO(contact: any): ContactResponseDTO {
    return {
      _id: contact._id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: contact.subject,
      message: contact.message,
      status: contact.status,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }
}
