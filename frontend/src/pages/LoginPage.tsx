import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../hooks/useQueries';
import { UserRole } from '../backend';
import { Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, isInitializing } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const [error, setError] = useState<string>('');

  const isLoggingIn = loginStatus === 'logging-in';
  const isAuthenticated = !!identity;

  // Check if user is admin and redirect
  if (isAuthenticated && !roleLoading && userRole === UserRole.admin) {
    navigate({ to: '/admin' });
  }

  const handleLogin = async () => {
    setError('');
    try {
      await login();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    }
  };

  const handleBackToHome = () => {
    navigate({ to: '/' });
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/assets/generated/mahendra-logo-transparent.dim_200x200.png" 
              alt="Mahendra Art Bar Logo" 
              className="h-16 w-16 object-contain"
            />
            <span className="text-3xl font-bold text-primary">Mahendra Art Bar</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-card p-8 rounded-lg shadow-xl border border-border">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isAuthenticated && userRole !== UserRole.admin && !roleLoading && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You do not have admin privileges. Please contact the administrator.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Click the button below to authenticate using Internet Identity
              </p>
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn || isAuthenticated}
                className="w-full"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : isAuthenticated ? (
                  'Authenticated'
                ) : (
                  'Login with Internet Identity'
                )}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleBackToHome}
              className="w-full"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Only authorized administrators can access the admin panel
        </p>
      </div>
    </div>
  );
}
