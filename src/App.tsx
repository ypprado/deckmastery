
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import CardLibrary from "@/pages/CardLibrary";
import DeckBuilder from "@/pages/DeckBuilder";
import DeckView from "@/pages/DeckView";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Admin from "@/pages/Admin";
import AdminRoute from "@/components/auth/AdminRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="auth" element={<Auth />} />
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="cards"
            element={
              <PrivateRoute>
                <CardLibrary />
              </PrivateRoute>
            }
          />
          <Route
            path="deck-builder"
            element={
              <PrivateRoute>
                <DeckBuilder />
              </PrivateRoute>
            }
          />
          <Route
            path="decks/:id"
            element={
              <PrivateRoute>
                <DeckView />
              </PrivateRoute>
            }
          />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
