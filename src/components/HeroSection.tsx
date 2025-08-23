import { Button } from "@/components/ui/button";
import { Download, Apple, Monitor, Smartphone } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const detectOS = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Windows';
  };

  const handleDownload = (os: string) => {
    // Placeholder for actual download logic
    console.log(`Downloading for ${os}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 hero-bg"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(10, 132, 255, 0.9) 0%, rgba(76, 159, 255, 0.8) 50%, rgba(147, 51, 234, 0.7) 100%), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/15 rounded-full blur-md animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* App Logo Placeholder */}
        <div className="mb-8 animate-slide-up">
          <div className="w-24 h-24 mx-auto mb-6 glass rounded-3xl flex items-center justify-center">
            <Download className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Download <span className="text-gradient bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">AppName</span>
          <br />for Any Device
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
          Available on Windows, macOS, and Linux. Fast, secure, and always up to date.
        </p>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Button 
            className="download-btn-primary group"
            onClick={() => handleDownload('Windows')}
          >
            <Monitor className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            Download for Windows
          </Button>
          
          <Button 
            className="download-btn-primary group"
            onClick={() => handleDownload('macOS')}
          >
            <Apple className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            Download for macOS
          </Button>
          
          <Button 
            className="download-btn-primary group"
            onClick={() => handleDownload('Linux')}
          >
            <Smartphone className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            Download for Linux
          </Button>
        </div>

        {/* Auto-detect Note */}
        <p className="text-white/70 mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          We detected you're using <span className="font-semibold text-white">{detectOS()}</span>
        </p>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-16 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">500K+</div>
            <div className="text-white/70">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">4.9★</div>
            <div className="text-white/70">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">99.9%</div>
            <div className="text-white/70">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;