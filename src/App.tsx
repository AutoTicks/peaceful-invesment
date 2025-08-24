import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import RouteGuard from "@/components/RouteGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateAccount from "./pages/CreateAccount";
import VerificationCenter from "./pages/VerificationCenter";
import MetaTraderAccounts from "./pages/MetaTraderAccounts";
import OverseasCompany from "./pages/OverseasCompany";
import Referrals from "./pages/Referrals";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteGuard>
            <div className="min-h-screen w-full">
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/verification" element={<VerificationCenter />} />
                <Route path="/meta-trader-accounts" element={<MetaTraderAccounts />} />
                <Route path="/overseas-company" element={<OverseasCompany />} />
                <Route path="/referrals" element={<Referrals />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/requests" element={<Requests />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </RouteGuard>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
