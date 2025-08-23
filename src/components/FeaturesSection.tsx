import { Zap, Shield, RotateCcw, Globe } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Fast & Lightweight",
      description: "Optimized for performance with minimal resource usage. Lightning-fast startup and smooth operation.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption and privacy-first design. Your data stays safe and secure at all times.",
    },
    {
      icon: RotateCcw,
      title: "Auto Updates",
      description: "Always stay current with automatic updates. New features and security patches delivered seamlessly.",
    },
    {
      icon: Globe,
      title: "Cross-Platform",
      description: "One app, all platforms. Seamless experience across Windows, macOS, and Linux systems.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose <span className="text-gradient">AppName</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the perfect blend of performance, security, and usability. 
            Built for professionals who demand excellence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card group text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-20 glass-card text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            And Much More...
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-muted-foreground">
            <div>• Offline mode support</div>
            <div>• Dark & light themes</div>
            <div>• Keyboard shortcuts</div>
            <div>• Plugin ecosystem</div>
            <div>• Cloud synchronization</div>
            <div>• 24/7 customer support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;