/**
 * Image Service
 * Handles downloading and processing external image URLs, storing as Base64
 */

import axios from 'axios';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

export class ImageService {
  /**
   * Descargar imagen desde URL externa y convertir a Base64
   * @param imageUrl URL de la imagen externa
   * @returns Promise<string> Imagen en formato Base64 con prefijo de tipo MIME
   */
  static async downloadAndConvertToBase64(imageUrl: string): Promise<string> {
    try {
      // Validar URL
      const url = new URL(imageUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('URL debe usar HTTP o HTTPS');
      }

      // Descargar imagen con timeout de 10s
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      // Validar content-type
      const contentType =
        response.headers['content-type'] || 'image/jpeg';
      if (!contentType.startsWith('image/')) {
        throw new Error('La URL debe apuntar a una imagen válida');
      }

      // Convertir a Base64
      const base64Data = Buffer.from(response.data, 'binary').toString(
        'base64',
      );
      return `data:${contentType};base64,${base64Data}`;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error descargando imagen: ${error.message}`);
      }
      throw new Error('Error desconocido descargando imagen');
    }
  }

  /**
   * Validar si una URL es externa válida
   */
  static isExternalUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Procesar imagen: si es URL externa, descargar; si es ya una URL local, mantenerla
   */
  static async processImageInput(
    imageInput: string | undefined,
  ): Promise<string | undefined> {
    if (!imageInput) return undefined;

    // Si ya es Base64 o URL local, devolver tal cual
    if (imageInput.startsWith('data:') || !this.isExternalUrl(imageInput)) {
      return imageInput;
    }

    // Si es URL externa, descargar y convertir
    return this.downloadAndConvertToBase64(imageInput);
  }
}
