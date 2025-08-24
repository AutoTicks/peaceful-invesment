import { Button } from "@/components/ui/button";
import { Monitor, Apple, Smartphone, Download, FileText, HelpCircle } from "lucide-react";

const DownloadSection = () => {
  const downloads = [
    {
      os: "Windows",
      icon: Monitor,
      version: "v3.2.1",
      size: "52.4 MB",
      requirements: "Windows 10 or later",
      downloadUrl: "#",
      badge: "Most Popular",
    },
    {
      os: "macOS",
      icon: Apple,
      version: "v3.2.1",
      size: "58.9 MB",
      requirements: "macOS 11.0 or later",
      downloadUrl: "#",
      badge: null,
    },
    {
      os: "Linux",
      icon: Smartphone,
      version: "v3.2.1",
      size: "41.7 MB",
      requirements: "Ubuntu 20.04+ / Fedora 34+",
      downloadUrl: "#",
      badge: null,
    },
  ];

  const handleDownload = (os: string) => {
    console.log(`Downloading Peaceful Investment for ${os}`);
  };

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Download the App for <span className="text-gradient">Your Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started with Peaceful Investment on your preferred operating system. 
            All platforms receive simultaneous updates and feature parity.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {downloads.map((download, index) => (
            <div 
              key={download.os} 
              className="glass-card hover:glow-primary group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Badge */}
              {download.badge && (
                <div className="absolute top-4 right-4 bg-gradient-primary text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {download.badge}
                </div>
              )}

              {/* OS Icon & Title */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-primary rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:glow-primary">
                  <download.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Peaceful Investment
                </h3>
                <p className="text-sm text-muted-foreground">for {download.os}</p>
              </div>

              {/* Version Info */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-semibold text-foreground">{download.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-semibold text-foreground">{download.size}</span>
                </div>
                <div className="text-center text-sm text-muted-foreground border-t pt-3">
                  Requires: {download.requirements}
                </div>
              </div>

              {/* Download Button */}
              <Button 
                className="w-full download-btn-primary mb-4 group/btn"
                onClick={() => handleDownload(download.os)}
              >
                <Download className="w-5 h-5 mr-2 group-hover/btn:animate-bounce" />
                Download for {download.os}
              </Button>

              {/* Secondary Links */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 download-btn-secondary">
                  <FileText className="w-4 h-4 mr-1" />
                  Guide
                </Button>
                <Button variant="outline" size="sm" className="flex-1 download-btn-secondary">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Requirements
                </Button>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Additional Options */}
        <div className="glass-card text-center">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Advanced Installation Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="download-btn-secondary">
              📦 Portable Version
            </Button>
            <Button variant="outline" className="download-btn-secondary">
              🔧 Beta Releases
            </Button>
            <Button variant="outline" className="download-btn-secondary">
              📜 Previous Versions
            </Button>
            <Button variant="outline" className="download-btn-secondary">
              🛠️ Source Code
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 bg-accent-green rounded-full"></div>
              <span>Digitally Signed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 bg-accent-cyan rounded-full"></div>
              <span>Virus Scanned</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 bg-accent-green rounded-full"></div>
              <span>SSL Download</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 bg-accent-cyan rounded-full"></div>
              <span>Auto-Updates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;