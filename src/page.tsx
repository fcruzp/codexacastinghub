import { useNavigate, Link } from "react-router-dom";
import { Film, Clapperboard, UserCircle, ArrowRight } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Puedes agregar lógica para verificar el rol del usuario aquí si es necesario
    // Por ahora, simplemente redirigimos a la página de registro como ejemplo
    navigate("/auth/register");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90 z-0" />
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
        />
        <div className="container relative z-10 mx-auto px-4 py-24 sm:py-32 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              The Ultimate Casting Platform
            </h1>
            <p className="text-xl mb-8">
              Connect actors with casting directors seamlessly. Create stunning profiles,
              upload your best work, and find the perfect roles for your career.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-white text-blue-900 hover:bg-blue-50 font-medium"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate("/browse")}
              >
                Browse Talent
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything you need in one place
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform streamlines the casting process from start to finish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card shadow-md hover:shadow-lg transition-shadow overflow-hidden border-0">
              <div className="h-2 bg-blue-500" />
              <CardContent className="pt-6">
                <div className="bg-blue-100 text-blue-700 rounded-full p-3 inline-flex mb-4">
                  <UserCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Rich Actor Profiles</h3>
                <p className="text-muted-foreground">
                  Create detailed profiles with all your vital statistics, experience,
                  and skills to stand out to casting directors.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-md hover:shadow-lg transition-shadow overflow-hidden border-0">
              <div className="h-2 bg-purple-500" />
              <CardContent className="pt-6">
                <div className="bg-purple-100 text-purple-700 rounded-full p-3 inline-flex mb-4">
                  <Film className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Media Portfolio</h3>
                <p className="text-muted-foreground">
                  Upload headshots, reels, voice recordings and resumes to showcase
                  your talent in the best possible light.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-md hover:shadow-lg transition-shadow overflow-hidden border-0">
              <div className="h-2 bg-amber-500" />
              <CardContent className="pt-6">
                <div className="bg-amber-100 text-amber-700 rounded-full p-3 inline-flex mb-4">
                  <Clapperboard className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Casting Projects</h3>
                <p className="text-muted-foreground">
                  Casting companies can create detailed project listings to attract
                  the perfect actors for their productions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple process designed for both actors and casting directors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-12">
              <h3 className="text-2xl font-medium mb-6">For Actors</h3>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Create your profile</h4>
                  <p className="text-muted-foreground">
                    Sign up and build a comprehensive profile with all your details
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Upload your media</h4>
                  <p className="text-muted-foreground">
                    Add headshots, reels, and other media to showcase your talent
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Apply to projects</h4>
                  <p className="text-muted-foreground">
                    Browse available casting calls and apply to relevant opportunities
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <h3 className="text-2xl font-medium mb-6">For Casting Directors</h3>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-purple-100 text-purple-700 rounded-full h-10 w-10 flex items-center justify-center">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Create company profile</h4>
                  <p className="text-muted-foreground">
                    Sign up and create your casting company profile
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-purple-100 text-purple-700 rounded-full h-10 w-10 flex items-center justify-center">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Post casting projects</h4>
                  <p className="text-muted-foreground">
                    Create detailed listings for your upcoming productions
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-purple-100 text-purple-700 rounded-full h-10 w-10 flex items-center justify-center">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Review applications</h4>
                  <p className="text-muted-foreground">
                    Browse applications, view actor profiles, and select talent
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Ready to transform your casting process?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Join thousands of actors and casting directors already using our platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-primary hover:bg-primary-foreground font-medium"
            >
              Get Started Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials/Stats section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Trusted by the industry
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who rely on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">5,000+</p>
              <p className="text-muted-foreground">Registered Actors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-muted-foreground">Casting Companies</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">2,000+</p>
              <p className="text-muted-foreground">Projects Posted</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
              <p className="text-muted-foreground">Successful Matches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Film className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">CastingPortal</span>
              </div>
              <p className="text-muted-foreground mt-2">
                Connecting talent with opportunity
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16">
              <div>
                <h3 className="font-medium mb-3">Platform</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
                  <li><Link to="/features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                  <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                  <li><Link to="/support" className="text-muted-foreground hover:text-foreground">Support</Link></li>
                  <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
                  <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 mt-8 text-center md:text-left text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CastingPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
