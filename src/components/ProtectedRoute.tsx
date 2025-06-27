import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false); // pour éviter les toasts multiples

  useEffect(() => {
    if (!loading && !user && !toastShown.current) {
      toast.error("Veuillez vous connecter pour accéder à cette page");
      toastShown.current = true;
    }
  }, [loading, user]);

  if (loading) {
    return <div>Chargement de l'utilisateur...</div>; // ou un vrai loader
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
