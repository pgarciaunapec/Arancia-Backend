/**
 * User Service
 * Handles user profile operations: get, update, manage user data
 */

import { User } from "../models/User";
import { UpdateProfileRequestDTO, UserResponseDTO } from "../dtos/index";
import { ISavedAddress, ISavedCard } from "../types/index";
import { Types } from "mongoose";

export class UserService {
  /**
   * Get user by ID
   */
  static async getById(id: string): Promise<UserResponseDTO> {
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return this.mapToResponseDTO(user);
  }

  /**
   * Get user by email
   */
  static async getByEmail(email: string): Promise<UserResponseDTO> {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "-password",
    );
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return this.mapToResponseDTO(user);
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    id: string,
    dto: UpdateProfileRequestDTO,
  ): Promise<UserResponseDTO> {
    const updateData: Record<string, any> = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.phone) updateData.phone = dto.phone;
    if (dto.address) updateData.address = dto.address;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return this.mapToResponseDTO(user);
  }

  /**
   * Get all users (admin)
   */
  static async getAll(
    skip: number = 0,
    limit: number = 10,
    role?: string,
  ): Promise<{
    data: UserResponseDTO[];
    total: number;
  }> {
    const filter: Record<string, any> = {};
    if (role) filter.role = role;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      data: users.map((user) => this.mapToResponseDTO(user)),
      total,
    };
  }

  /**
   * Update user role (admin)
   */
  static async updateRole(id: string, role: string): Promise<UserResponseDTO> {
    if (!["customer", "staff", "admin"].includes(role)) {
      throw new Error("Rol inválido");
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    ).select("-password");

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return this.mapToResponseDTO(user);
  }

  /**
   * Delete user (admin)
   */
  static async delete(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
  }

  /**
   * Get saved addresses for user
   */
  static async getSavedAddresses(userId: string): Promise<ISavedAddress[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user.savedAddresses || [];
  }

  /**
   * Add saved address for user
   */
  static async addSavedAddress(
    userId: string,
    addressData: Partial<ISavedAddress>,
  ): Promise<ISavedAddress> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (!user.savedAddresses) {
      user.savedAddresses = [];
    }

    const newAddress: ISavedAddress = {
      _id: new Types.ObjectId(),
      ...addressData,
    } as ISavedAddress;

    user.savedAddresses.push(newAddress);
    await user.save();
    return newAddress;
  }

  /**
   * Update saved address for user
   */
  static async updateSavedAddress(
    userId: string,
    addressId: string,
    addressData: Partial<ISavedAddress>,
  ): Promise<ISavedAddress> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (!user.savedAddresses) {
      throw new Error("No se encontró la dirección");
    }

    const addressIndex = user.savedAddresses.findIndex(
      (addr) => addr._id?.toString() === addressId,
    );

    if (addressIndex === -1) {
      throw new Error("Dirección no encontrada");
    }

    user.savedAddresses[addressIndex] = {
      ...user.savedAddresses[addressIndex],
      ...addressData,
      _id: user.savedAddresses[addressIndex]._id,
    } as ISavedAddress;

    await user.save();
    return user.savedAddresses[addressIndex];
  }

  /**
   * Delete saved address for user
   */
  static async deleteSavedAddress(userId: string, addressId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (!user.savedAddresses) {
      throw new Error("No se encontró la dirección");
    }

    user.savedAddresses = user.savedAddresses.filter(
      (addr) => addr._id?.toString() !== addressId,
    );

    await user.save();
  }

  /**
   * Get saved cards for user
   */
  static async getSavedCards(userId: string): Promise<ISavedCard[]> {
    const user = await User.findById(userId).select("+savedCards");
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    // never return cardHash - only last4 and metadata
    return (user.savedCards || []).map((card) => ({
      ...card,
      cardHash: undefined, // explicitly exclude
    }));
  }

  /**
   * Add saved card for user (only stores last4, not full number)
   */
  static async addSavedCard(
    userId: string,
    cardData: Partial<ISavedCard>,
  ): Promise<ISavedCard> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (!user.savedCards) {
      user.savedCards = [];
    }

    const newCard: ISavedCard = {
      _id: new Types.ObjectId(),
      ...cardData,
    } as ISavedCard;

    user.savedCards.push(newCard);
    await user.save();

    // never return cardHash
    return {
      ...newCard,
      cardHash: undefined,
    };
  }

  /**
   * Update saved card for user
   */
  static async updateSavedCard(
    userId: string,
    cardId: string,
    cardData: Partial<ISavedCard>,
  ): Promise<ISavedCard> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (!user.savedCards) {
      throw new Error("No se encontró la tarjeta");
    }

    const cardIndex = user.savedCards.findIndex(
      (card) => card._id?.toString() === cardId,
    );

    if (cardIndex === -1) {
      throw new Error("Tarjeta no encontrada");
    }

    user.savedCards[cardIndex] = {
      ...user.savedCards[cardIndex],
      ...cardData,
      _id: user.savedCards[cardIndex]._id,
    } as ISavedCard;

    await user.save();
    return {
      ...user.savedCards[cardIndex],
      cardHash: undefined,
    };
  }

  /**
   * Delete saved card for user
   */
  static async deleteSavedCard(userId: string, cardId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (!user.savedCards) {
      throw new Error("No se encontró la tarjeta");
    }

    user.savedCards = user.savedCards.filter(
      (card) => card._id?.toString() !== cardId,
    );

    await user.save();
  }

  /**
   * Map to response DTO
   */
  private static mapToResponseDTO(user: any): UserResponseDTO {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
