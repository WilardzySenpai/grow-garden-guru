
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminSetup from "./pages/AdminSetup";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import BugReport from "./pages/BugReport";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
            <AuthProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/app" element={<Index />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/admin/setup" element={<AdminSetup />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/bug-report" element={<BugReport />} />
                                            <Route path="/admin/setup" element={<AdminSetup />} />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </AuthProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;
