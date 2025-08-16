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
import { LandingFaq } from './entities/landing-faq.entity';
import { LandingFeature } from './entities/landing-feature.entity';
import { FaqController } from './controllers/faq.controller';
import { FeaturesController } from './controllers/features.controller';
import { FaqService } from './services/faq.service';
import { FeaturesService } from './services/features.service';
import { FooterService } from './services/footer.service';
import { FooterController } from './controllers/footer.controller';
import { LandingFooter } from './entities/landing-footer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LandingAudience,
      LandingHowItWorks,
      LandingTestimonial,
      LandingFaq,
      LandingFeature,
      LandingFooter,
    ]),
  ],
  controllers: [
    AudiencesController,
    HowItWorksController,
    TestimonialsController,
    FaqController,
    FeaturesController,
    FooterController,
  ],
  providers: [
    AudiencesService,
    HowItWorksService,
    TestimonialsService,
    FaqService,
    FeaturesService,
    FooterService,
  ],
})
export class LandingModule {}
