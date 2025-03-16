
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingFallback from "@/components/shared/LoadingFallback";

type PrivateRouteProps = {
  element: React.ReactNode;
};

export function PrivateRoute({ element }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  
  // If we're loading auth state, show loading spinner
  if (loading) {
    return <LoadingFallback />;
  }
  
  // If not logged in, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" />;
   }
  
  // If logged in, render the component
  return <>{element}</>;
}

export default PrivateRoute;
