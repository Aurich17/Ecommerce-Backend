import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingAudience } from './entities/landing-audience.entity';
import { LandingHowItWorks } from './entities/landing-howitworks.entity';
import { LandingTestimonial } from './entities/landing-testimonial.entity';
import { AudiencesService } from './services/audiences.service';
import { HowItWorksService } from './services/howitworks.service';
import { TestimonialsService } from './services/testimonials.service';
import { AudiencesController } from './controllers/audiences.controller';
import { HowItWorksController } from './controllers/howitworks.controller';
import { TestimonialsController } from './controllers/testimonials.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LandingAudience,
      LandingHowItWorks,
      LandingTestimonial,
    ]),
  ],
  controllers: [
    AudiencesController,
    HowItWorksController,
    TestimonialsController,
  ],
  providers: [AudiencesService, HowItWorksService, TestimonialsService],
})
export class LandingModule {}
