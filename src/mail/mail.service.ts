import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chumpitazismael7@gmail.com',
        pass: 'raaedphjjehqtzcs', // generado en Google
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    return this.transporter.sendMail({
      from: '"FiaoX" <chumpitazismael7@gmail.com>',
      to,
      subject,
      html: text,
    });
  }
}
