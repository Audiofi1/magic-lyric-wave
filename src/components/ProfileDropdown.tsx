import { useState, useEffect } from 'react';
import { User, Library, Wallet, UserCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setLoading(false);
  };

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => navigate('/auth')}
        className="bg-white text-black hover:bg-white/90"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <UserCircle className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border-border">
        <DropdownMenuItem onClick={() => navigate('/library')} className="cursor-pointer">
          <Library className="w-4 h-4 mr-2" />
          Library
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Profile Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/wallet')} className="cursor-pointer">
          <Wallet className="w-4 h-4 mr-2" />
          Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
