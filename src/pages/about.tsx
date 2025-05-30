import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Globe, Users, Award, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900/90 to-purple-900/90">
        <div className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')" }}
        />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Acerca de CastingApp</h1>
            <p className="text-xl opacity-90">
              La primera plataforma de casting dominicana que conecta talento con oportunidades
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-12">
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-semibold mb-4">Nuestra Historia</h2>
                  <p className="text-muted-foreground mb-6">
                    Nacida en el corazón de Santo Domingo, CastingApp surge como una respuesta innovadora 
                    a las necesidades de la industria del entretenimiento dominicano. Somos la primera 
                    plataforma de casting que combina tecnología de vanguardia con el talento local, 
                    creando un puente entre actores y directores de casting.
                  </p>
                  <p className="text-muted-foreground">
                    Nuestra misión es democratizar el acceso a oportunidades en la industria del 
                    entretenimiento, haciendo que el proceso de casting sea más accesible, transparente 
                    y eficiente para todos los involucrados.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Film className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Innovación Local</h3>
                      <p className="text-muted-foreground">
                        Primera plataforma de casting dominicana que integra tecnología de punta con 
                        el talento local, revolucionando la forma en que se conectan actores y directores.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Alcance Global</h3>
                      <p className="text-muted-foreground">
                        Conectamos talento dominicano con oportunidades internacionales, expandiendo 
                        el alcance de nuestros actores a nivel global.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Comunidad Activa</h3>
                      <p className="text-muted-foreground">
                        Más de 5,000 actores y 500 empresas de casting ya confían en nuestra plataforma, 
                        creando una comunidad vibrante y en constante crecimiento.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Calidad Garantizada</h3>
                      <p className="text-muted-foreground">
                        Verificación rigurosa de perfiles y proyectos, asegurando un ambiente profesional 
                        y confiable para todos los usuarios.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Values Section */}
            <Card className="mb-12">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Nuestros Valores</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Pasión</h3>
                    <p className="text-muted-foreground">
                      Amamos el arte y creemos en el poder transformador del talento dominicano.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Excelencia</h3>
                    <p className="text-muted-foreground">
                      Nos esforzamos por ofrecer la mejor experiencia y servicio a nuestra comunidad.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Comunidad</h3>
                    <p className="text-muted-foreground">
                      Construimos una comunidad inclusiva que celebra la diversidad y el talento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">¿Listo para unirte a nuestra comunidad?</h2>
              <p className="text-muted-foreground mb-8">
                Únete a miles de actores y directores que ya están transformando la industria del casting
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/auth/register">Comenzar Ahora</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Contáctanos</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 