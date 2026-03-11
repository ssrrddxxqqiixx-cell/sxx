import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin-login";
import AdminControlPanel from "@/pages/admin-control-panel";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminUsersDashboard from "@/pages/admin-users-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin/control-panel" component={AdminControlPanel} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin-dashboard" component={AdminUsersDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function PublicRouter() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="border-t border-white/10 bg-background/50 backdrop-blur py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-display tracking-widest text-sm">
            © {new Date().getFullYear()} 𝐔𝐀𝐀 𝐒𝐓𝐎𝐑𝐄. FIVE M ROLEPLAY STORE. NOT AFFILIATED WITH ROCKSTAR GAMES.
          </p>
        </div>
      </footer>
    </div>
  );
}

function MainRouter() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  const isHyphenAdminRoute = location.startsWith("/admin-");
  
  if (isAdminRoute || isHyphenAdminRoute) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin/control-panel" component={AdminControlPanel} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin-dashboard" component={AdminUsersDashboard} />
        <Route component={NotFound} />
      </Switch>
    );
  }
  
  return <PublicRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MainRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
