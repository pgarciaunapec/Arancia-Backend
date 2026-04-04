/**
 * User Service
 * Handles user profile operations: get, update, manage user data
 */

import { User } from "../models/User";
import { UpdateProfileRequestDTO, UserResponseDTO } from "../dtos/index";

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
