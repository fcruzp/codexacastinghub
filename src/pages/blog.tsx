import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Cómo Preparar un Portafolio de Actor Efectivo",
    excerpt: "Aprende las mejores prácticas para crear un portafolio que destaque tu talento y experiencia en el mundo del casting.",
    author: "María González",
    date: "15 Mar 2024",
    readTime: "5 min",
    imageUrl: "https://images.pexels.com/photos/3762876/pexels-photo-3762876.jpeg"
  },
  {
    id: "2",
    title: "Tendencias en Casting Digital 2024",
    excerpt: "Descubre cómo la tecnología está transformando el proceso de casting y qué habilidades digitales necesitas dominar.",
    author: "Carlos Rodríguez",
    date: "12 Mar 2024",
    readTime: "7 min",
    imageUrl: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
  },
  {
    id: "3",
    title: "Guía para Audiciones Virtuales",
    excerpt: "Consejos prácticos para sobresalir en audiciones en línea y aprovechar al máximo las oportunidades digitales.",
    author: "Ana Martínez",
    date: "10 Mar 2024",
    readTime: "6 min",
    imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900/90 to-purple-900/90">
        <div className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')" }}
        />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Blog de Casting</h1>
            <p className="text-xl opacity-90">
              Descubre consejos, tendencias y recursos para impulsar tu carrera en el mundo del casting
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <Button variant="outline" className="w-full">
                    Leer más
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 