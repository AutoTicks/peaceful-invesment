import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Shield, ChevronDown, User, Settings, LogOut, Shield as VerificationIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Simplified main navigation for logged-in users
  const mainNavLinks = user ? [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Trading", href: "/trading" },
    { name: "Accounts", href: "/meta-trader-accounts" },
    { name: "Referrals", href: "/referrals" },
    { name: "Blog", href: "/blog" },
  ] : [
    { name: "Home", href: "/" },
    { name: "Downloads", href: "/downloads" },
    { name: "Blog", href: "/blog" },
    { name: "Features", href: "/#features" },
    { name: "About", href: "/#about" },
  ];

  // Services dropdown for logged-in users
  const servicesLinks = [
    { name: "Overseas Company", href: "/overseas-company" },
    { name: "Requests", href: "/requests" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Peaceful Investment
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Main navigation links */}
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}

            {/* Services Dropdown for logged-in users */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Services
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-background/95 backdrop-blur-xl border border-border/40">
                  {servicesLinks.map((link) => (
                    <DropdownMenuItem key={link.name} asChild>
                      <Link to={link.href} className="w-full cursor-pointer">
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-3 py-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{user.email?.split('@')[0]}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-xl border border-border/40" align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 w-full cursor-pointer">
                        <User className="h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/verification" className="flex items-center gap-2 w-full cursor-pointer">
                        <VerificationIcon className="h-4 w-4" />
                        Verification Center
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/auth">
                  <Button variant="ghost" className="font-medium">Login</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="download-btn-primary font-medium">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-xl border-t border-border/40">
              {/* Main nav links */}
              {mainNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Services for mobile */}
              {user && (
                <>
                  <div className="px-3 py-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Services
                  </div>
                  {servicesLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="block px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  <div className="px-3 py-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Account
                  </div>
                  <Link
                    to="/profile"
                    className="block px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/verification"
                    className="block px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Verification Center
                  </Link>
                </>
              )}
              
              <div className="px-3 py-4 space-y-3 border-t border-border/40 mt-4">
                <ThemeToggle />
                {user ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground px-3">
                      {user.email}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }} 
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full font-medium">Login</Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                      <Button className="download-btn-primary w-full font-medium">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;