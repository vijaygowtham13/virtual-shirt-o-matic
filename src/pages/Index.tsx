
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VirtualTryOn from '../components/VirtualTryOn';
import { TryOnProvider } from '../context/TryOnContext';
import { Star, Package, Zap, Award } from 'lucide-react';

const Index = () => {
  return (
    <TryOnProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative py-20 px-6 md:px-8 overflow-hidden" id="try-on-section">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,190,255,0.1),transparent_55%)]"></div>
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="space-y-8 animate-slide-up">
                  <div>
                    <div className="inline-flex rounded-full items-center px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
                      <span className="mr-1">✨</span> Revolutionary Virtual Try-On
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground !leading-[1.1]">
                      Try Before You Buy, <br />
                      <span className="text-primary">Virtually</span>
                    </h1>
                  </div>
                  
                  <p className="text-lg text-muted-foreground max-w-lg">
                    Experience clothing in a whole new way with our state-of-the-art virtual try-on technology. See how clothes look on you before purchasing, all from the comfort of your home.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button 
                      className="button-primary"
                      onClick={() => {
                        const element = document.getElementById('try-on-section');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                          // Add a small delay before activating the webcam
                          setTimeout(() => {
                            const context = document.querySelector('[data-context="TryOnContext"]');
                            if (context) {
                              const setWebcamActive = (context as any).__TryOnContext_setWebcamActive;
                              if (typeof setWebcamActive === 'function') {
                                setWebcamActive(true);
                              }
                            }
                          }, 500);
                        }
                      }}
                    >
                      Try It Now
                    </button>
                    <button 
                      className="button-secondary"
                      onClick={() => {
                        const element = document.getElementById('how-it-works');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
                
                <div className="relative animate-fade-in">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl opacity-50"></div>
                  <div className="relative">
                    <VirtualTryOn />
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* How It Works Section */}
          <section className="py-20 px-6 md:px-8" id="how-it-works">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Our virtual try-on technology is simple to use and provides an immersive experience.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-medium">Enable Your Camera</h3>
                  <p className="text-muted-foreground">
                    Allow camera access so our technology can visualize clothes on you in real-time.
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-medium">Select Your Clothing</h3>
                  <p className="text-muted-foreground">
                    Browse through our collection and choose items you'd like to try on.
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-medium">See Results Instantly</h3>
                  <p className="text-muted-foreground">
                    Our AI overlays the clothing on your body so you can see how it looks on you.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-20 px-6 md:px-8 bg-muted/30" id="features">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold">Revolutionary Features</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Our virtual try-on technology offers unparalleled features to enhance your shopping experience.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-background rounded-2xl p-6 shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                    <Zap className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Real-Time Processing</h3>
                  <p className="text-muted-foreground text-sm">
                    Advanced AI processes webcam feed in real-time to provide an accurate visualization.
                  </p>
                </div>
                
                <div className="bg-background rounded-2xl p-6 shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                    <Package className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Extensive Catalog</h3>
                  <p className="text-muted-foreground text-sm">
                    Browse through thousands of clothing items from popular brands to virtually try on.
                  </p>
                </div>
                
                <div className="bg-background rounded-2xl p-6 shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                    <Award className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Precise Measurements</h3>
                  <p className="text-muted-foreground text-sm">
                    Body tracking technology ensures accurate sizing and proper placement of virtual clothes.
                  </p>
                </div>
                
                <div className="bg-background rounded-2xl p-6 shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                    <Star className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Personalized Experience</h3>
                  <p className="text-muted-foreground text-sm">
                    Save your favorite looks and receive recommendations based on your style preferences.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Gallery Section */}
          <section className="py-20 px-6 md:px-8" id="gallery">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold">Gallery</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  See examples of our virtual try-on technology in action.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="rounded-xl overflow-hidden shadow-sm border border-border/40 hover:shadow-md transition-all duration-300">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                          src={`/shirts/shirt${(item % 5) + 1}.png`} 
                          alt={`Example ${item}`}
                          className="object-contain max-h-full p-4" 
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">User Example {item}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        See how this shirt looks on a real person using our virtual try-on feature.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Testimonial Section */}
          <section className="py-20 px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                <div className="absolute right-0 top-0 -mt-20 -mr-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute left-0 bottom-0 -mb-20 -ml-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                
                <div className="relative max-w-3xl mx-auto text-center">
                  <div className="flex justify-center mb-8">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-muted">
                          <img 
                            src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                            alt={`User ${i}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="ml-4 flex items-center rounded-full py-1 px-3 bg-background/90 text-sm font-medium">
                      <span className="text-primary">4.9</span>
                      <span className="ml-1 text-muted-foreground">from 2,000+ reviews</span>
                    </div>
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-medium text-foreground">
                    "The virtual try-on feature completely changed how I shop online. I can now confidently purchase clothes knowing exactly how they'll look on me. The technology is incredibly precise!"
                  </blockquote>
                  
                  <div className="mt-8">
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Fashion Enthusiast</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-primary/90 to-primary rounded-3xl p-8 md:p-12 lg:p-16 text-white">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                  <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your shopping experience?</h2>
                  <p className="text-primary-foreground/90 text-lg">
                    Join thousands of satisfied customers who have revolutionized the way they shop for clothes.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <button 
                      className="px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-white/90 transition-colors"
                      onClick={() => {
                        const tryOnSection = document.getElementById('try-on-section');
                        if (tryOnSection) {
                          tryOnSection.scrollIntoView({ behavior: 'smooth' });
                          // Add a small delay before activating the webcam
                          setTimeout(() => {
                            const context = document.querySelector('[data-context="TryOnContext"]');
                            if (context) {
                              const setWebcamActive = (context as any).__TryOnContext_setWebcamActive;
                              if (typeof setWebcamActive === 'function') {
                                setWebcamActive(true);
                              }
                            }
                          }, 500);
                        }
                      }}
                    >
                      Try It Now
                    </button>
                    <button 
                      className="px-8 py-3 bg-primary-foreground/10 text-white border border-white/30 rounded-full font-medium hover:bg-primary-foreground/20 transition-colors"
                      onClick={() => {
                        const element = document.getElementById('how-it-works');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </TryOnProvider>
  );
};

export default Index;
