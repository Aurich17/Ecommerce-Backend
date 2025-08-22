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
import { LandingSlider } from './entities/landing-slider.entity';
import { LandingSliderController } from './controllers/landing-slider.controller';
import { LandingSliderService } from './services/landing-slider.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LandingAudience,
      LandingHowItWorks,
      LandingTestimonial,
      LandingFaq,
      LandingFeature,
      LandingFooter,
      LandingSlider,
    ]),
  ],
  controllers: [
    AudiencesController,
    HowItWorksController,
    TestimonialsController,
    FaqController,
    FeaturesController,
    FooterController,
    LandingSliderController,
  ],
  providers: [
    AudiencesService,
    HowItWorksService,
    TestimonialsService,
    FaqService,
    FeaturesService,
    FooterService,
    LandingSliderService,
  ],
})
export class LandingModule {}
