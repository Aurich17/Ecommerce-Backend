import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from 'src/auth/public.decorator';
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
@Public()
  @Post('send')
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
  ) {
    return this.mailService.sendMail(to, subject, text);
  }
}
