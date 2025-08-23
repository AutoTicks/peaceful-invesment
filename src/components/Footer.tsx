import { Github, Twitter, Mail, MessageSquare, Globe, Shield, FileText, Bot } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "System Requirements", href: "#" },
      { name: "Release Notes", href: "#" },
    ],
    support: [
      { name: "Documentation", href: "#" },
      { name: "Video Tutorials", href: "#" },
      { name: "Community Forum", href: "#" },
      { name: "Contact Support", href: "#" },
    ],
    resources: [
      { name: "Trading Guides", href: "#" },
      { name: "EA Development", href: "#" },
      { name: "API Documentation", href: "#" },
      { name: "Best Practices", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Security", href: "#" },
      { name: "Risk Disclosure", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#" },
    { name: "Twitter/X", icon: Twitter, href: "#" },
    { name: "Telegram", icon: MessageSquare, href: "#" },
    { name: "Email", icon: Mail, href: "#" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">MetaTrader Bot Manager</span>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed mb-6 max-w-sm">
              The ultimate solution for managing and monitoring your MetaTrader 
              Expert Advisors. Trade smarter, not harder.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-secondary-foreground/10 hover:bg-accent-cyan flex items-center justify-center transition-colors group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>

            {/* Trading Disclaimer */}
            <p className="text-xs text-secondary-foreground/60">
              ⚠️ Trading involves substantial risk of loss and is not suitable for all investors.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-accent-cyan transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-accent-cyan transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-accent-cyan transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-accent-cyan transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust & Security Badges */}
        <div className="border-t border-secondary-foreground/20 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <Shield className="w-4 h-4 text-accent-green" />
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <FileText className="w-4 h-4 text-accent-cyan" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <Globe className="w-4 h-4 text-accent-green" />
                <span>99.9% Uptime SLA</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-secondary-foreground/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <span>•</span>
              <span>Version 3.2.1 • Updated 12 hours ago</span>
            </div>
          </div>
        </div>

        {/* Platform Compatibility */}
        <div className="border-t border-secondary-foreground/20 pt-8 mb-8">
          <div className="text-center mb-4">
            <h4 className="font-semibold text-secondary-foreground mb-2">Platform Compatibility</h4>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-secondary-foreground/60">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span className="text-sm">MetaTrader 4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <span className="text-sm">MetaTrader 5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪟</span>
              <span className="text-sm">Windows 10+</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍎</span>
              <span className="text-sm">macOS 11+</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐧</span>
              <span className="text-sm">Linux</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">☁️</span>
              <span className="text-sm">VPS Ready</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-secondary-foreground/60">
              © 2024 MetaTrader Bot Manager. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-secondary-foreground/60">
              <span>Built for professional traders worldwide</span>
              <span>•</span>
              <a href="#" className="hover:text-accent-cyan transition-colors">
                Report Issue
              </a>
              <span>•</span>
              <a href="#" className="hover:text-accent-cyan transition-colors">
                Feature Request
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;