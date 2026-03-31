import { Menu, X, Phone, Mail, MapPin, Clock, Edit, Save, XCircle, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetWebsiteContent, useUpdateWebsiteContent } from '../hooks/useQueries';
import { EditModeProvider, useEditMode } from '../components/EditModeProvider';
import { EditableText } from '../components/EditableText';
import { EditableImage } from '../components/EditableImage';
import { WebsiteContent, Section, GalleryImage, ExternalBlob } from '../backend';
import { toast } from 'sonner';

function HomePageContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: websiteContent, isLoading: contentLoading } = useGetWebsiteContent();
  const updateContent = useUpdateWebsiteContent();
  const { isEditMode, toggleEditMode, setEditMode } = useEditMode();

  const [editedContent, setEditedContent] = useState<WebsiteContent | null>(null);

  // Automatically enable edit mode when admin is detected
  useEffect(() => {
    if (!adminLoading && isAdmin && !isEditMode) {
      setEditMode(true);
    }
  }, [isAdmin, adminLoading, isEditMode, setEditMode]);

  useEffect(() => {
    if (websiteContent) {
      setEditedContent(websiteContent);
    }
  }, [websiteContent]);

  const isAuthenticated = !!identity;
  const showEditControls = isAuthenticated && isAdmin && !adminLoading;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleAdminClick = () => {
    if (isAuthenticated && isAdmin) {
      navigate({ to: '/admin' });
    } else {
      navigate({ to: '/login' });
    }
    setMobileMenuOpen(false);
  };

  const handleSaveChanges = async () => {
    if (!editedContent) return;

    try {
      await updateContent.mutateAsync(editedContent);
      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    if (websiteContent) {
      setEditedContent(websiteContent);
    }
    toast.info('Changes discarded');
  };

  const updateSection = (index: number, field: keyof Section, value: string | ExternalBlob | null) => {
    if (!editedContent) return;
    const newSections = [...editedContent.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setEditedContent({ ...editedContent, sections: newSections });
  };

  const updateGalleryImage = (index: number, field: keyof GalleryImage, value: string | ExternalBlob) => {
    if (!editedContent) return;
    const newGallery = [...editedContent.gallery];
    newGallery[index] = { ...newGallery[index], [field]: value };
    setEditedContent({ ...editedContent, gallery: newGallery });
  };

  if (contentLoading || !editedContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Extract sections by title for easier access
  const heroSection = editedContent.sections.find(s => s.title === 'Hero') || { title: 'Hero', subtitle: '', description: '' };
  const aboutSection = editedContent.sections.find(s => s.title === 'About') || { title: 'About', subtitle: '', description: '' };
  const gallerySection = editedContent.sections.find(s => s.title === 'Gallery') || { title: 'Gallery', subtitle: '', description: '' };
  const contactSection = editedContent.sections.find(s => s.title === 'Contact') || { title: 'Contact', subtitle: '', description: '' };

  const heroIndex = editedContent.sections.findIndex(s => s.title === 'Hero');
  const aboutIndex = editedContent.sections.findIndex(s => s.title === 'About');
  const galleryIndex = editedContent.sections.findIndex(s => s.title === 'Gallery');
  const contactIndex = editedContent.sections.findIndex(s => s.title === 'Contact');

  return (
    <div className="min-h-screen bg-background">
      {/* Edit Mode Indicator Badge */}
      {isEditMode && showEditControls && (
        <div className="fixed top-24 right-6 z-50">
          <Badge variant="destructive" className="text-lg px-4 py-2 shadow-lg animate-pulse">
            <Eye className="mr-2 h-5 w-5" />
            Edit Mode ON
          </Badge>
        </div>
      )}

      {/* Edit Mode Controls */}
      {showEditControls && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {!isEditMode ? (
            <Button
              onClick={toggleEditMode}
              size="lg"
              className="shadow-lg"
            >
              <Edit className="mr-2 h-5 w-5" />
              Edit Mode
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSaveChanges}
                disabled={updateContent.isPending}
                size="lg"
                className="shadow-lg"
              >
                <Save className="mr-2 h-5 w-5" />
                {updateContent.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                size="lg"
                className="shadow-lg"
              >
                <XCircle className="mr-2 h-5 w-5" />
                Cancel
              </Button>
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/generated/mahendra-logo-transparent.dim_200x200.png" 
                alt="Mahendra Art Bar Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-bold text-primary">Mahendra Art Bar</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-foreground hover:text-primary transition-colors font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="text-foreground hover:text-primary transition-colors font-medium">
                About Us
              </button>
              <button onClick={() => scrollToSection('gallery')} className="text-foreground hover:text-primary transition-colors font-medium">
                Gallery
              </button>
              <button onClick={() => scrollToSection('services')} className="text-foreground hover:text-primary transition-colors font-medium">
                Services
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-foreground hover:text-primary transition-colors font-medium">
                Contact
              </button>
              <button onClick={handleAdminClick} className="text-foreground hover:text-primary transition-colors font-medium">
                Admin
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-4">
                <button onClick={() => scrollToSection('home')} className="text-foreground hover:text-primary transition-colors font-medium text-left">
                  Home
                </button>
                <button onClick={() => scrollToSection('about')} className="text-foreground hover:text-primary transition-colors font-medium text-left">
                  About Us
                </button>
                <button onClick={() => scrollToSection('gallery')} className="text-foreground hover:text-primary transition-colors font-medium text-left">
                  Gallery
                </button>
                <button onClick={() => scrollToSection('services')} className="text-foreground hover:text-primary transition-colors font-medium text-left">
                  Services
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-foreground hover:text-primary transition-colors font-medium text-left">
                  Contact
                </button>
                <button onClick={handleAdminClick} className="text-foreground hover:text-primary transition-colors font-medium text-left">
                  Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden mt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/generated/hero-background.dim_1200x600.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {heroIndex >= 0 && (
            <>
              <EditableText
                value={heroSection.title}
                onChange={(value) => updateSection(heroIndex, 'title', value)}
                className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
                as="h1"
              />
              <EditableText
                value={heroSection.subtitle || ''}
                onChange={(value) => updateSection(heroIndex, 'subtitle', value)}
                className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md"
                as="p"
              />
            </>
          )}
          <Button 
            size="lg" 
            onClick={() => scrollToSection('contact')}
            className="text-lg px-8 py-6"
          >
            Contact Us Now
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {aboutIndex >= 0 && (
                <>
                  <EditableText
                    value={aboutSection.title}
                    onChange={(value) => updateSection(aboutIndex, 'title', value)}
                    className="text-4xl font-bold text-foreground mb-6"
                    as="h2"
                  />
                  <EditableText
                    value={aboutSection.description || ''}
                    onChange={(value) => updateSection(aboutIndex, 'description', value)}
                    multiline
                    className="text-lg text-muted-foreground mb-4 leading-relaxed"
                  />
                </>
              )}
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              {aboutIndex >= 0 && (
                <EditableImage
                  src={aboutSection.image ? aboutSection.image.getDirectURL() : '/assets/generated/about-image.dim_500x400.jpg'}
                  alt="About Mahendra Art Bar"
                  className="w-full h-full object-cover"
                  onImageChange={(blob) => {
                    updateSection(aboutIndex, 'image', blob);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {galleryIndex >= 0 && (
              <>
                <EditableText
                  value={gallerySection.title}
                  onChange={(value) => updateSection(galleryIndex, 'title', value)}
                  className="text-4xl font-bold text-foreground mb-4"
                  as="h2"
                />
                <EditableText
                  value={gallerySection.description || 'Our collection includes various types of artworks that reflect Indian culture and tradition'}
                  onChange={(value) => updateSection(galleryIndex, 'description', value)}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                  as="p"
                />
              </>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {editedContent.gallery.length > 0 ? (
              editedContent.gallery.map((artwork, index) => (
                <div 
                  key={artwork.id} 
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <EditableImage
                    src={artwork.imageUrl.getDirectURL()}
                    alt={artwork.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    onImageChange={(blob) => {
                      updateGalleryImage(index, 'imageUrl', blob);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <EditableText
                        value={artwork.title}
                        onChange={(value) => updateGalleryImage(index, 'title', value)}
                        className="text-white text-xl font-semibold"
                        as="p"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to default images if gallery is empty
              [
                { src: '/assets/generated/artwork-1.dim_400x300.jpg', title: 'Traditional Art' },
                { src: '/assets/generated/artwork-2.dim_400x300.jpg', title: 'Modern Art' },
                { src: '/assets/generated/artwork-3.dim_400x300.jpg', title: 'Mixed Media' },
                { src: '/assets/generated/artwork-4.dim_400x300.jpg', title: 'Contemporary Art' },
              ].map((artwork, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <img
                    src={artwork.src}
                    alt={artwork.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white text-xl font-semibold p-4">{artwork.title}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer various services that make your experience memorable
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Art Exhibitions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Regularly organized art exhibitions showcasing works by local and national artists.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Art Workshops</h3>
              <p className="text-muted-foreground leading-relaxed">
                Workshops and training programs in various art forms available for all age groups.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Cultural Events</h3>
              <p className="text-muted-foreground leading-relaxed">
                Organization of music, dance, and other cultural events that keep Indian culture alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/generated/contact-bg.dim_800x400.jpg)' }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            {contactIndex >= 0 && (
              <>
                <EditableText
                  value={contactSection.title}
                  onChange={(value) => updateSection(contactIndex, 'title', value)}
                  className="text-4xl font-bold text-foreground mb-4"
                  as="h2"
                />
                <EditableText
                  value={contactSection.description || ''}
                  onChange={(value) => updateSection(contactIndex, 'description', value)}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                  as="p"
                />
              </>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Address</h3>
                  <p className="text-muted-foreground">
                    Mahendra Art Bar<br />
                    Art Nagar, Main Road<br />
                    New Delhi - 110001
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Phone</h3>
                  <p className="text-muted-foreground">
                    +91 98765 43210<br />
                    +91 98765 43211
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    info@mahendraartbar.com<br />
                    contact@mahendraartbar.com
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 10:00 AM - 10:00 PM<br />
                    Saturday - Sunday: 11:00 AM - 11:00 PM
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-xl">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/assets/generated/mahendra-logo-transparent.dim_200x200.png" 
                  alt="Mahendra Art Bar Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold">Mahendra Art Bar</span>
              </div>
              <p className="text-secondary-foreground/80">
                A Unique Blend of Art, Culture, and Taste
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('home')} className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about')} className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('gallery')} className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                    Gallery
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                    Services
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <p className="text-secondary-foreground/80 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                +91 98765 43210
              </p>
              <p className="text-secondary-foreground/80">
                <Mail className="inline w-4 h-4 mr-2" />
                info@mahendraartbar.com
              </p>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 pt-8 text-center">
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
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <EditModeProvider>
      <HomePageContent />
    </EditModeProvider>
  );
}
