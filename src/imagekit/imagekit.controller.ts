// src/imagekit/imagekit.controller.ts
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
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
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: any,
  ) {
    const tags = Array.isArray(body?.tags)
      ? body.tags
      : safeParseArray(body?.tags);

    let res: any;
    if (file) {
      // Flujo A: sube desde el servidor
      res = await this.ik.uploadFromBuffer(
        file.buffer,
        body?.fileName || file.originalname,
        body?.folder || '/uploads',
        tags,
      );
    } else if (body?.fileId && body?.url) {
      // Flujo B: ya subiste en el navegador, normaliza lo recibido
      res = {
        fileId: body.fileId,
        url: body.url,
        thumbnailUrl: body.thumbnailUrl,
        width: num(body.width),
        height: num(body.height),
        size: num(body.size),
        fileType: body.format ?? body.fileType ?? 'image',
        tags,
      };
    } else {
      throw new BadRequestException(
        'Envía multipart con "file" o JSON con {fileId, url, ...}.',
      );
    }

    // (Opcional) persistir en BD:
    // const saved = await this.media.create({
    //   fileId: res.fileId,
    //   url: res.url,
    //   thumbnailUrl: res.thumbnailUrl,
    //   width: res.width,
    //   height: res.height,
    //   size: res.size,
    //   format: res.fileType,
    //   tags: res.tags,
    // });
    // return { ...res, mediaId: saved.id };

    return res; // si no persistes aquí
  }
}

function safeParseArray(s?: string): string[] | undefined {
  if (!s) return undefined;
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : undefined;
  } catch {
    return undefined;
  }
}

function num(v: any): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
