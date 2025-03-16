
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

// Pages
import Layout from "./components/layout/Layout";
import LoadingFallback from "./components/shared/LoadingFallback";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DeckBuilder = lazy(() => import("./pages/DeckBuilder"));
const DeckView = lazy(() => import("./pages/DeckView"));
const CardLibrary = lazy(() => import("./pages/CardLibrary"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={
                <Suspense fallback={<LoadingFallback />}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="deck/new" element={
                <Suspense fallback={<LoadingFallback />}>
                  <PrivateRoute element={<DeckBuilder />} />
                </Suspense>
              } />
              <Route path="deck/:id" element={
                <Suspense fallback={<LoadingFallback />}>
                  <DeckView />
                </Suspense>
              } />
              <Route path="cards" element={
                <Suspense fallback={<LoadingFallback />}>
                  <CardLibrary />
                </Suspense>
              } />
              <Route path="auth" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Auth />
                </Suspense>
              } />
              <Route path="*" element={
                <Suspense fallback={<LoadingFallback />}>
                  <NotFound />
                </Suspense>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
