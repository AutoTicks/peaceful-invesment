import { useState } from "react";
import { Monitor, Apple, Smartphone, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InstallGuide = () => {
  const [activeOS, setActiveOS] = useState("windows");

  const installSteps = {
    windows: [
      {
        step: 1,
        title: "Download the installer",
        description: "Click the Windows download button above to get the .exe installer file.",
        icon: "📥"
      },
      {
        step: 2,
        title: "Run the installer",
        description: "Double-click the downloaded AppName-Setup.exe file to start installation.",
        icon: "🚀"
      },
      {
        step: 3,
        title: "Follow the setup wizard",
        description: "Choose your installation directory and preferences in the setup wizard.",
        icon: "⚙️"
      },
      {
        step: 4,
        title: "Launch the application",
        description: "Find AppName in your Start menu or desktop shortcut and start using it!",
        icon: "✨"
      }
    ],
    macos: [
      {
        step: 1,
        title: "Download the DMG file",
        description: "Click the macOS download button to get the .dmg disk image file.",
        icon: "📥"
      },
      {
        step: 2,
        title: "Mount the disk image",
        description: "Double-click the downloaded .dmg file to mount it and open the installer window.",
        icon: "💿"
      },
      {
        step: 3,
        title: "Drag to Applications",
        description: "Drag the AppName icon to your Applications folder to install it.",
        icon: "📁"
      },
      {
        step: 4,
        title: "Launch from Applications",
        description: "Open AppName from your Applications folder or Spotlight search.",
        icon: "✨"
      }
    ],
    linux: [
      {
        step: 1,
        title: "Download the package",
        description: "Choose between .deb (Ubuntu/Debian) or .rpm (Fedora/RHEL) package.",
        icon: "📥"
      },
      {
        step: 2,
        title: "Install the package",
        description: "Run 'sudo dpkg -i appname.deb' or 'sudo rpm -i appname.rpm' in terminal.",
        icon: "💻"
      },
      {
        step: 3,
        title: "Resolve dependencies",
        description: "If needed, run 'sudo apt-get install -f' to fix any dependency issues.",
        icon: "🔧"
      },
      {
        step: 4,
        title: "Launch the application",
        description: "Find AppName in your application menu or run 'appname' in terminal.",
        icon: "✨"
      }
    ]
  };

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Simple <span className="text-gradient">Installation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get up and running in minutes. Our installation process is designed to be 
            straightforward and hassle-free across all platforms.
          </p>
        </div>

        {/* OS Tabs */}
        <Tabs value={activeOS} onValueChange={setActiveOS} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card mb-12">
            <TabsTrigger value="windows" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Windows
            </TabsTrigger>
            <TabsTrigger value="macos" className="flex items-center gap-2">
              <Apple className="w-4 h-4" />
              macOS
            </TabsTrigger>
            <TabsTrigger value="linux" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Linux
            </TabsTrigger>
          </TabsList>

          {/* Installation Steps */}
          {Object.entries(installSteps).map(([os, steps]) => (
            <TabsContent key={os} value={os}>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div 
                    key={step.step}
                    className="glass-card flex items-start gap-6 group hover:glow-primary"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                        {step.step}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{step.icon}</span>
                        <h3 className="text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Check Icon */}
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-accent-green opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Help Section */}
        <div className="mt-16 text-center glass-card">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Need Help with Installation?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you get started. Don't hesitate to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#" 
              className="download-btn-secondary inline-flex items-center justify-center"
            >
              📖 View Documentation
            </a>
            <a 
              href="#" 
              className="download-btn-secondary inline-flex items-center justify-center"
            >
              💬 Contact Support
            </a>
            <a 
              href="#" 
              className="download-btn-secondary inline-flex items-center justify-center"
            >
              🎥 Watch Video Guide
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstallGuide;