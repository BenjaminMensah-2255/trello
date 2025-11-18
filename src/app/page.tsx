import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import VisualFeature from './components/VisualFeature';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="w-full flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-6xl flex-1 px-4">
            <Hero />
            <Features />
            <VisualFeature />
            <CTA />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}