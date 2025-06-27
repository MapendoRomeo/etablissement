
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { School, User, LogOut, Menu, X, Settings, Home, Users, Calendar, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { schoolType } = useParams<{ schoolType?: string }>();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isMobile = useIsMobile();
  
  const getSchoolName = () => {
    if (!schoolType) return '';
    return schoolType === 'maternelle' 
      ? 'École Maternelle' 
      : schoolType === 'primaire' 
        ? 'École Primaire' 
        : 'École Secondaire';
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    toast.success('Déconnexion réussie');
    navigate('/login');
  };
  
  // Hide profile menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-profile-menu]')) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  const navigationLinks = [
    { path: '/', label: 'Accueil', icon: <Home className="h-4 w-4 mr-2" /> },
    ...(schoolType ? [
      { path: `/dashboard/${schoolType}`, label: 'Tableau de bord', icon: <Home className="h-4 w-4 mr-2" /> },
      { path: `/students/${schoolType}`, label: 'Élèves', icon: <Users className="h-4 w-4 mr-2" /> },
      { path: `/payments/${schoolType}`, label: 'Paiements', icon: <CreditCard className="h-4 w-4 mr-2" /> },
    ] : []),
    { path: '/settings', label: 'Paramètres', icon: <Settings className="h-4 w-4 mr-2" /> },
    { path: '/user-management', label: 'Gestion des utilisateurs', icon: <Users className="h-4 w-4 mr-2" /> },
    { path: '/school-year-config', label: 'Configuration année scolaire', icon: <Calendar className="h-4 w-4 mr-2" /> },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="h-6 w-6 text-primary" />
            <Link to="/" className="text-xl font-semibold tracking-tight">
              GestionÉcole
            </Link>
            {schoolType && (
              <div className="hidden md:flex items-center ml-4">
                <span className="text-muted-foreground mx-2">|</span>
                <span className="font-medium">{getSchoolName()}</span>
              </div>
            )}
          </div>
          
          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navigationLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`transition-colors hover:text-primary ${
                  location.pathname === link.path || location.pathname.includes(link.path.split('/')[1]) 
                    ? 'text-primary' 
                    : 'text-foreground/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Menu mobile"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border/40 flex items-center gap-2">
                      <School className="h-5 w-5 text-primary" />
                      <span className="font-semibold">GestionÉcole</span>
                      {schoolType && (
                        <div className="flex items-center ml-2">
                          <span className="text-muted-foreground mx-1">|</span>
                          <span className="font-medium text-sm">{getSchoolName()}</span>
                        </div>
                      )}
                    </div>
                    
                    <nav className="flex-1 overflow-auto p-4">
                      <ul className="space-y-2">
                        {navigationLinks.map((link) => (
                          <li key={link.path}>
                            <Link
                              to={link.path}
                              className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                                location.pathname === link.path || location.pathname.includes(link.path.split('/')[1])
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'hover:bg-muted'
                              }`}
                            >
                              {link.icon}
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                    
                    <div className="border-t border-border/40 p-4">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-destructive hover:bg-destructive/10 rounded-md py-2 px-3 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <div className="relative" data-profile-menu>
              <button 
                className="rounded-full h-8 w-8 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                }}
                aria-label="Menu profil"
              >
                <span className="sr-only">Profil</span>
                <User className="h-4 w-4" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-10 border border-border">
                  <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                    Connecté en tant qu'<span className="font-medium">admin</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 animate-fade-in">
        {children}
      </main>
      
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GestionÉcole. Tous droits réservés.
          </p>
          <nav className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/terms" className="hover:underline underline-offset-4">
              Conditions d'utilisation
            </Link>
            <Link to="/privacy" className="hover:underline underline-offset-4">
              Politique de confidentialité
            </Link>
            <Link to="/contact" className="hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
