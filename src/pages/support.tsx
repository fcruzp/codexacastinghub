import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MessageCircle, Phone, Mail, Search } from "lucide-react";

const faqItems = [
  {
    question: "¿Cómo puedo crear mi perfil de actor?",
    answer: "Para crear tu perfil de actor, regístrate en la plataforma, selecciona el tipo de cuenta 'Actor' y sigue el asistente paso a paso para completar tu información personal, experiencia y portafolio."
  },
  {
    question: "¿Cómo funciona el proceso de casting?",
    answer: "Los directores de casting publican proyectos con sus requisitos. Los actores pueden postularse a los proyectos que coincidan con su perfil. Los directores revisan las postulaciones y contactan a los candidatos seleccionados."
  },
  {
    question: "¿Puedo actualizar mi información después de registrarme?",
    answer: "Sí, puedes actualizar tu información en cualquier momento desde la sección 'Mi Perfil'. Te recomendamos mantener tu perfil actualizado para aumentar tus oportunidades."
  }
];

export default function Support() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900/90 to-purple-900/90">
        <div className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')" }}
        />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Centro de Soporte</h1>
            <p className="text-xl opacity-90">
              Estamos aquí para ayudarte en cada paso de tu viaje
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar en el centro de ayuda..."
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Chat en Vivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Conéctate con nuestro equipo de soporte en tiempo real
                </p>
                <Button className="w-full">Iniciar Chat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Correo Electrónico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Envíanos un correo y te responderemos en 24 horas
                </p>
                <Button variant="outline" className="w-full">
                  Enviar Email
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Teléfono</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Llámanos de lunes a viernes de 9:00 a 18:00
                </p>
                <Button variant="outline" className="w-full">
                  +1 (829) 764-5851
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              ¿No encuentras lo que buscas?
            </h2>
            <Card>
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre</label>
                      <Input placeholder="Tu nombre" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="tu@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Asunto</label>
                    <Input placeholder="¿En qué podemos ayudarte?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mensaje</label>
                    <Textarea
                      placeholder="Describe tu consulta en detalle..."
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button className="w-full">Enviar Mensaje</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
} 