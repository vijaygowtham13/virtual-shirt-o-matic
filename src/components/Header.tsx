
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTryOn } from '../context/TryOnContext';

const Header: React.FC = () => {
  const { setWebcamActive } = useTryOn();
  
  const handleNavigation = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleTryItNow = () => {
    const tryOnSection = document.getElementById('try-on-section');
    if (tryOnSection) {
      tryOnSection.scrollIntoView({ behavior: 'smooth' });
      // Give the browser a moment to scroll before activating
      setTimeout(() => {
        setWebcamActive(true);
      }, 300);
    }
  };
  
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between bg-background/80 backdrop-blur-lg sticky top-0 z-50 border-b border-border/40">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-medium">Virtual Try-On</h1>
        <span className="text-sm text-muted-foreground py-0.5 px-2 rounded-full bg-muted">Beta</span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#how-it-works" onClick={handleNavigation('how-it-works')} className="text-foreground/90 hover:text-foreground transition-colors">
          How It Works
        </a>
        <a href="#features" onClick={handleNavigation('features')} className="text-foreground/90 hover:text-foreground transition-colors">
          Features
        </a>
        <a href="#gallery" onClick={handleNavigation('gallery')} className="text-foreground/90 hover:text-foreground transition-colors">
          Gallery
        </a>
      </nav>
      
      <div className="flex items-center space-x-4">
        <button className="button-secondary hidden md:block">
          Share
        </button>
        <button className="button-primary flex items-center" onClick={handleTryItNow}>
          <span>Get Started</span>
          <ChevronRight className="ml-1 w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
