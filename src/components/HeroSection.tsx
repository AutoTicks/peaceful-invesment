import { Button } from "@/components/ui/button";
import { Download, Apple, Monitor, Smartphone, Bot, TrendingUp } from "lucide-react";
import tradingHeroBg from "@/assets/trading-hero-bg.jpg";
import dashboardMockup from "@/assets/dashboard-mockup.jpg";

const HeroSection = () => {
  const detectOS = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Windows';
  };

  const handleDownload = (os: string) => {
    // Placeholder for actual download logic
    console.log(`Downloading Peaceful Investment App for ${os}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Trading Hero Background */}
      <div 
        className="absolute inset-0 hero-bg"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(11, 27, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(0, 198, 255, 0.1) 100%), url(${tradingHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Floating Trading Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent-cyan/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent-green/10 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-accent-cyan/15 rounded-full blur-md animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Trading symbols floating */}
        <div className="absolute top-20 right-20 text-accent-cyan/20 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>$</div>
        <div className="absolute bottom-20 left-20 text-accent-green/20 text-3xl animate-float" style={{ animationDelay: '1.5s' }}>₿</div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left lg:text-left">
            {/* Bot Icon */}
            <div className="mb-8 animate-slide-up">
              <div className="w-20 h-20 mx-auto lg:mx-0 mb-6 glass rounded-3xl flex items-center justify-center">
                <Bot className="w-10 h-10 text-accent-cyan" />
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Control Your <span className="text-gradient bg-gradient-to-r from-accent-cyan to-accent-green bg-clip-text text-transparent">Investment Bots</span> from Anywhere
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
              Peaceful Investment - Easily manage strategies, monitor trades, and optimize performance.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-start animate-slide-up" style={{ animationDelay: '0.6s' }}>
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
            <p className="text-accent-cyan/80 mt-6 animate-fade-in flex items-center gap-2" style={{ animationDelay: '0.8s' }}>
              <TrendingUp className="w-4 h-4" />
              Detected OS: <span className="font-semibold text-white">{detectOS()}</span> • Works with MT4 & MT5
            </p>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              <div className="glass-card p-4">
                <img 
                  src={dashboardMockup} 
                  alt="MetaTrader Bot Manager Dashboard" 
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
              </div>
              {/* Floating metrics */}
              <div className="absolute -top-4 -right-4 glass-card p-4 animate-float">
                <div className="text-accent-green text-sm font-semibold">+1,247 USD</div>
                <div className="text-white/70 text-xs">Today's Profit</div>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-accent-cyan text-sm font-semibold">94.2%</div>
                <div className="text-white/70 text-xs">Win Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-20 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50K+</div>
            <div className="text-white/70">Active Traders</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">$2.8B+</div>
            <div className="text-white/70">Volume Managed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">99.9%</div>
            <div className="text-white/70">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-white/70">Monitoring</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;