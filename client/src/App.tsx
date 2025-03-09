import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { IcebergBackground } from "@/components/IcebergBackground";
import Calculator from "@/pages/calculator";
import NotFound from "@/pages/not-found";
import "./i18n/i18n";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Calculator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IcebergBackground />
      <div className="relative z-10">
        <Router />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;