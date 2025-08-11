// src/imagekit/imagekit.controller.ts
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagekitService } from './imagekit.service';

@Controller('imagekit')
export class ImagekitController {
  constructor(private readonly ik: ImagekitService) {}

  // Para el frontend: firma de autenticación
  @Get('auth')
  auth() {
    return this.ik.getAuthParams();
  }

  // Opción alternativa: subir vía servidor (si no quieres upload directo desde el navegador)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const res = await this.ik.uploadFromBuffer(
      file.buffer,
      body?.fileName || file.originalname,
      body?.folder,
      body?.tags,
    );
    return res; // contiene fileId, url, thumbnailUrl, width, height, size, etc.
  }
}
