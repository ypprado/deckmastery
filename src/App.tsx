import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import DeckBuilder from "./pages/DeckBuilder";
import DeckView from "./pages/DeckView";
import CardLibrary from "./pages/CardLibrary";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";
import StaticDataManager from "./pages/StaticDataManager";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="auth" element={<Auth />} />
          
          <Route path="dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="deck/new" element={
            <PrivateRoute>
              <DeckBuilder />
            </PrivateRoute>
          } />
          
          <Route path="deck/:id" element={
            <PrivateRoute>
              <DeckView />
            </PrivateRoute>
          } />
          
          <Route path="deck/:id/edit" element={
            <PrivateRoute>
              <DeckBuilder />
            </PrivateRoute>
          } />
          
          <Route path="admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
          
          <Route path="cards" element={<CardLibrary />} />
          <Route path="static-data" element={<StaticDataManager />} />
          <Route path="profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
