import { PageTitle } from '../shared/ui/PageTitle';
import { AboutSection } from './home/AboutSection';
import { HomeHero } from './home/HomeHero';
import { HowItWorks } from './home/HowItWorks';
import { Reviews } from './home/Reviews';

export function HomePage() {
  return (
    <>
      <PageTitle />
      <HomeHero />
      <main>
        <AboutSection />
        <HowItWorks />
        <Reviews />
      </main>
    </>
  );
}
