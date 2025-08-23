import { Github, Twitter, Linkedin, Mail, Globe, Shield, FileText } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Updates", href: "#" },
      { name: "Beta Program", href: "#" },
    ],
    support: [
      { name: "Documentation", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "System Status", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press Kit", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Security", href: "#" },
      { name: "Licenses", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
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
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">AppName</span>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed mb-6 max-w-sm">
              The powerful, cross-platform application that simplifies your workflow 
              and boosts productivity across Windows, macOS, and Linux.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
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
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
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
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Security & Trust Badges */}
        <div className="border-t border-secondary-foreground/20 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <Shield className="w-4 h-4 text-accent-green" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <FileText className="w-4 h-4 text-accent-green" />
                <span>GDPR Ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <Shield className="w-4 h-4 text-accent-green" />
                <span>256-bit Encryption</span>
              </div>
            </div>
            
            <div className="text-sm text-secondary-foreground/60">
              Latest version: v2.1.4 • Updated 2 days ago
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-secondary-foreground/60">
              © 2024 AppName Inc. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-secondary-foreground/60">
              <span>Made with ❤️ for developers</span>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Report a bug
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Feature request
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;