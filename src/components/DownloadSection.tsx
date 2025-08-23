import { Button } from "@/components/ui/button";
import { Monitor, Apple, Smartphone, Download, FileText, HelpCircle } from "lucide-react";

const DownloadSection = () => {
  const downloads = [
    {
      os: "Windows",
      icon: Monitor,
      version: "v2.1.4",
      size: "45.2 MB",
      requirements: "Windows 10 or later",
      downloadUrl: "#",
      color: "blue",
    },
    {
      os: "macOS",
      icon: Apple,
      version: "v2.1.4",
      size: "52.8 MB",
      requirements: "macOS 11.0 or later",
      downloadUrl: "#",
      color: "gray",
    },
    {
      os: "Linux",
      icon: Smartphone,
      version: "v2.1.4",
      size: "38.4 MB",
      requirements: "Ubuntu 20.04+ / Fedora 34+",
      downloadUrl: "#",
      color: "orange",
    },
  ];

  const handleDownload = (os: string) => {
    console.log(`Downloading ${os} version`);
  };

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your <span className="text-gradient">Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get the version that's perfect for your system. All platforms receive 
            the same features and updates simultaneously.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {downloads.map((download, index) => (
            <div 
              key={download.os} 
              className="glass-card hover:glow-primary group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* OS Icon & Title */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-primary rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <download.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {download.os}
                </h3>
              </div>

              {/* Version Info */}
              <div className="space-y-3 mb-8 text-center">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-semibold text-foreground">{download.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-semibold text-foreground">{download.size}</span>
                </div>
                <div className="text-sm text-muted-foreground border-t pt-3">
                  {download.requirements}
                </div>
              </div>

              {/* Download Button */}
              <Button 
                className="w-full download-btn-primary mb-4"
                onClick={() => handleDownload(download.os)}
              >
                <Download className="w-5 h-5 mr-2" />
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
            </div>
          ))}
        </div>

        {/* Beta & Archive Downloads */}
        <div className="glass-card text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Looking for something else?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="download-btn-secondary">
              Beta Releases
            </Button>
            <Button variant="outline" className="download-btn-secondary">
              Previous Versions
            </Button>
            <Button variant="outline" className="download-btn-secondary">
              Source Code
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;