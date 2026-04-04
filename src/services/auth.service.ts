/**
 * Authentication Service
 * Handles user authentication, registration, login, password management
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { env } from "../config/env";
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  UserResponseDTO,
  ChangePasswordRequestDTO,
} from "../dtos/index";

export class AuthService {
  /**
   * Generate JWT token
   */
  static generateToken(id: string, email: string): string {
    return jwt.sign({ id, email }, env.jwtSecret as string, {
      expiresIn: env.jwtExpiresIn as string,
    });
  }

  /**
   * Register a new user
   */
  static async register(dto: RegisterRequestDTO): Promise<{
    user: UserResponseDTO;
    token: string;
  }> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: dto.email.toLowerCase() });
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // Create user
    const user = await User.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      phone: dto.phone,
      address: dto.address,
      role: "customer",
    });

    // Generate token
    const token = this.generateToken(user._id.toString(), user.email);

    // Return user response
    const userResponse = this.mapUserToResponseDTO(user);
    return { user: userResponse, token };
  }

  /**
   * Login user
   */
  static async login(dto: LoginRequestDTO): Promise<{
    user: UserResponseDTO;
    token: string;
  }> {
    // Find user
    const user = await User.findOne({
      email: dto.email.toLowerCase(),
    });
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas");
    }

    // Generate token
    const token = this.generateToken(user._id.toString(), user.email);

    // Return user response
    const userResponse = this.mapUserToResponseDTO(user);
    return { user: userResponse, token };
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): { id: string; email: string } {
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as {
        id: string;
        email: string;
      };
      return decoded;
    } catch {
      throw new Error("Token inválido o expirado");
    }
  }

  /**
   * Change password
   */
  static async changePassword(
    userId: string,
    dto: ChangePasswordRequestDTO,
  ): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Contraseña actual incorrecta");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();
  }

  /**
   * Map user document to response DTO
   */
  private static mapUserToResponseDTO(user: any): UserResponseDTO {
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
