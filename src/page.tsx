import { useNavigate, Link } from "react-router-dom";
import { Film, Clapperboard, UserCircle, ArrowRight, Check } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
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
              La Plataforma Definitiva de Casting
            </h1>
            <p className="text-xl mb-8">
              Conecta actores con directores de casting de manera fluida. Crea perfiles impresionantes,
              sube tu mejor trabajo y encuentra los roles perfectos para tu carrera.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-white text-blue-900 hover:bg-blue-50 font-medium"
                disabled={!!user}
              >
                Comenzar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => navigate("/explore")}
              >
                Explorar Talento
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
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nuestra plataforma optimiza el proceso de casting de principio a fin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card shadow-md hover:shadow-lg transition-shadow overflow-hidden border-0">
              <div className="h-2 bg-blue-500" />
              <CardContent className="pt-6">
                <div className="bg-blue-100 text-blue-700 rounded-full p-3 inline-flex mb-4">
                  <UserCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Perfiles Detallados</h3>
                <p className="text-muted-foreground">
                  Crea perfiles detallados con todas tus estadísticas vitales, experiencia
                  y habilidades para destacar ante los directores de casting.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-md hover:shadow-lg transition-shadow overflow-hidden border-0">
              <div className="h-2 bg-purple-500" />
              <CardContent className="pt-6">
                <div className="bg-purple-100 text-purple-700 rounded-full p-3 inline-flex mb-4">
                  <Film className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Portafolio Multimedia</h3>
                <p className="text-muted-foreground">
                  Sube fotos, reels, grabaciones de voz y currículums para mostrar
                  tu talento de la mejor manera posible.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-md hover:shadow-lg transition-shadow overflow-hidden border-0">
              <div className="h-2 bg-amber-500" />
              <CardContent className="pt-6">
                <div className="bg-amber-100 text-amber-700 rounded-full p-3 inline-flex mb-4">
                  <Clapperboard className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Proyectos de Casting</h3>
                <p className="text-muted-foreground">
                  Las empresas de casting pueden crear listados detallados para atraer
                  a los actores perfectos para sus producciones.
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
              Cómo Funciona
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un proceso simple diseñado tanto para actores como para directores de casting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-12">
              <h3 className="text-2xl font-medium mb-6">Para Actores</h3>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Crea tu perfil</h4>
                  <p className="text-muted-foreground">
                    Regístrate y construye un perfil completo con todos tus detalles
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Sube tu material</h4>
                  <p className="text-muted-foreground">
                    Añade fotos, reels y otros materiales para mostrar tu talento
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Postúlate a proyectos</h4>
                  <p className="text-muted-foreground">
                    Explora las convocatorias disponibles y postúlate a oportunidades relevantes
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <h3 className="text-2xl font-medium mb-6">Para Directores de Casting</h3>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-purple-100 text-purple-700 rounded-full h-10 w-10 flex items-center justify-center">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Crea el perfil de tu empresa</h4>
                  <p className="text-muted-foreground">
                    Regístrate y crea el perfil de tu empresa de casting
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-purple-100 text-purple-700 rounded-full h-10 w-10 flex items-center justify-center">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Publica proyectos</h4>
                  <p className="text-muted-foreground">
                    Crea listados detallados para tus próximas producciones
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-purple-100 text-purple-700 rounded-full h-10 w-10 flex items-center justify-center">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Revisa postulaciones</h4>
                  <p className="text-muted-foreground">
                    Explora las postulaciones, revisa perfiles de actores y selecciona talento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section - Solo visible si no hay usuario */}
      {!user && (
        <section className="py-16 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Planes y Precios
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Elige el plan que mejor se adapte a tus necesidades
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Plan Gratuito */}
              <Card className="relative overflow-hidden border-2">
                <div className="absolute top-0 right-0 bg-primary/10 px-4 py-1 rounded-bl-lg text-sm font-medium text-primary">
                  Popular
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Plan Gratuito</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Perfil básico</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Subir hasta 5 fotos</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Acceso a proyectos básicos</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={handleGetStarted}
                  >
                    Comenzar Gratis
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Pro */}
              <Card className="relative overflow-hidden border-2 border-primary">
                <div className="absolute top-0 right-0 bg-primary px-4 py-1 rounded-bl-lg text-sm font-medium text-primary-foreground">
                  Recomendado
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Plan Pro</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$10</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Todo lo del plan gratuito</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Subir hasta 20 fotos</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Acceso a proyectos premium</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Estadísticas avanzadas</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={handleGetStarted}
                  >
                    Comenzar Pro
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Enterprise */}
              <Card className="relative overflow-hidden border-2">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Plan Enterprise</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$20</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Todo lo del plan Pro</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Fotos ilimitadas</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Acceso prioritario a proyectos</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Soporte premium 24/7</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>Análisis de audiciones</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={handleGetStarted}
                  >
                    Comenzar Enterprise
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            ¿Listo para transformar tu proceso de casting?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Únete a miles de actores y directores de casting que ya usan nuestra plataforma
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              disabled={!!user}
            >
              Comenzar Ahora
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-black dark:border-white text-black dark:text-white hover:bg-black/10 hover:text-white hover:border-white dark:hover:bg-white/10 dark:hover:text-gray-400 dark:hover:border-gray-400 transition-colors"
            >
              <Link to="/about">Conoce Más</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials/Stats section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Confiado por la industria
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Únete a miles de profesionales que confían en nuestra plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">5,000+</p>
              <p className="text-muted-foreground">Actores Registrados</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-muted-foreground">Empresas de Casting</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">2,000+</p>
              <p className="text-muted-foreground">Proyectos Publicados</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
              <p className="text-muted-foreground">Coincidencias Exitosas</p>
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
                Conectando talento con oportunidades
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16">
              <div>
                <h3 className="font-medium mb-3">Plataforma</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-muted-foreground hover:text-foreground">Acerca de</Link></li>
                  <li><Link to="/explore" className="text-muted-foreground hover:text-foreground">Explorar</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Recursos</h3>
                <ul className="space-y-2">
                  <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                  <li><Link to="/support" className="text-muted-foreground hover:text-foreground">Soporte</Link></li>
                  <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contacto</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Términos</Link></li>
                  <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacidad</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
