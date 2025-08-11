// src/imagekit/imagekit.service.ts
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ImageKit = require('imagekit');

@Injectable()
export class ImagekitService {
  private ik = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  });

  getAuthParams() {
    return this.ik.getAuthenticationParameters();
  }

  async uploadFromBuffer(
    buffer: Buffer,
    fileName: string,
    folder = '/uploads',
    tags?: string[],
  ) {
    return this.ik.upload({
      file: buffer, // <— buffer
      fileName,
      folder,
      tags,
      useUniqueFileName: true,
    });
  }
}
