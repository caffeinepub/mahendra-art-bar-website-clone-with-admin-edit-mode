import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole, useGetWebsiteContent } from '../hooks/useQueries';
import { UserRole } from '../backend';
import { Loader2, LogOut, Home, Edit, Eye, Image, FileText, Palette } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, clear, isInitializing } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const { data: websiteContent, isLoading: contentLoading } = useGetWebsiteContent();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === UserRole.admin;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  // Redirect to login if not admin
  useEffect(() => {
    if (!roleLoading && isAuthenticated && !isAdmin) {
      navigate({ to: '/login' });
    }
  }, [isAdmin, roleLoading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleEditWebsite = () => {
    // Navigate to home page where edit mode can be activated
    navigate({ to: '/' });
  };

  if (isInitializing || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const sectionCount = websiteContent?.sections.length || 0;
  const galleryCount = websiteContent?.gallery.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/generated/mahendra-logo-transparent.dim_200x200.png" 
                alt="Mahendra Art Bar Logo" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary">Mahendra Art Bar</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Admin Dashboard</p>
                  <Badge variant="default" className="text-xs">
                    <Eye className="mr-1 h-3 w-3" />
                    Admin Mode
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleEditWebsite}>
                <Home className="mr-2 h-4 w-4" />
                View Website
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome, Administrator</h2>
            <p className="text-muted-foreground">
              You have full access to edit and manage your Mahendra Art Bar website content
            </p>
          </div>

          {/* Quick Edit Access Card */}
          <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Edit className="h-6 w-6 text-primary" />
                    Edit Mode - Direct Access
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Click below to start editing your website content in real-time
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  As an administrator, you can edit all website content including text, images, sections, and gallery items. 
                  Changes are saved directly to the backend and will be visible to all visitors immediately.
                </p>
                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleEditWebsite}
                    className="text-lg px-8"
                  >
                    <Edit className="mr-2 h-5 w-5" />
                    Start Editing Website
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={handleEditWebsite}
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Preview Website
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Overview */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Content Overview</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Sections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contentLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-foreground mb-2">{sectionCount}</p>
                      <p className="text-sm text-muted-foreground">
                        Active content sections
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Image className="h-5 w-5 text-primary" />
                    Gallery Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contentLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-foreground mb-2">{galleryCount}</p>
                      <p className="text-sm text-muted-foreground">
                        Artwork images in gallery
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Edit Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-success mb-2">Ready</p>
                  <p className="text-sm text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Editing Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Edit Your Website</CardTitle>
              <CardDescription>
                Follow these simple steps to update your website content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Navigate to Website</h4>
                    <p className="text-sm text-muted-foreground">
                      Click "Start Editing Website" or "View Website" button to go to the main website page.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Activate Edit Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Look for the "Edit Mode" button in the bottom-right corner and click it to enable editing. You'll see an "Edit Mode ON" badge appear.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Edit Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Click on any text to edit it inline. Click on images to upload new ones. All changes are made in real-time.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Save Changes</h4>
                    <p className="text-sm text-muted-foreground">
                      When you're done editing, click the "Save Changes" button to persist your updates to the backend. You can also cancel to discard changes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card className="mt-8 bg-muted/30">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-success">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">Administrator</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Principal ID:</span>
                  <span className="font-mono text-xs">{identity?.getPrincipal().toString().slice(0, 20)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Backend:</span>
                  <span className="font-medium text-success">Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-secondary-foreground/80">
            © 2025. Built with ❤️ using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-secondary-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
