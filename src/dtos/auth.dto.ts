/**
 * Auth DTOs - Data Transfer Objects for Authentication
 */

// Request DTOs
export interface RegisterRequestDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UpdateProfileRequestDTO {
  name?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordRequestDTO {
  currentPassword: string;
  newPassword: string;
}

// Response DTOs
export interface AuthResponseDTO {
  success: boolean;
  data: {
    user: UserResponseDTO;
    token: string;
  };
}

export interface UserResponseDTO {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "customer" | "staff" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenResponseDTO {
  token: string;
  expiresIn: string;
}
