import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    title: "1. Información que Recopilamos",
    content: "Recopilamos información que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, información de perfil, y cualquier otro contenido que subas a la plataforma. También recopilamos información sobre tu uso de la plataforma y el dispositivo que utilizas."
  },
  {
    title: "2. Uso de la Información",
    content: "Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, desarrollar nuevos servicios, proteger a CastingApp y a nuestros usuarios, y comunicarnos contigo sobre nuestros servicios."
  },
  {
    title: "3. Compartir Información",
    content: "No compartimos tu información personal con terceros excepto en las siguientes circunstancias: con tu consentimiento, para cumplir con obligaciones legales, para proteger nuestros derechos, o en caso de una fusión o adquisición de la empresa."
  },
  {
    title: "4. Seguridad de la Información",
    content: "Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra el acceso no autorizado, la alteración, la divulgación o la destrucción."
  },
  {
    title: "5. Tus Derechos",
    content: "Tienes derecho a acceder, corregir, eliminar y oponerte al procesamiento de tu información personal. También puedes solicitar una copia de tus datos personales en un formato estructurado y portátil."
  },
  {
    title: "6. Cookies y Tecnologías Similares",
    content: "Utilizamos cookies y tecnologías similares para recopilar información sobre tu uso de la plataforma. Puedes controlar el uso de cookies a través de la configuración de tu navegador."
  },
  {
    title: "7. Cambios en la Política de Privacidad",
    content: "Podemos actualizar esta política de privacidad de vez en cuando. Te notificaremos cualquier cambio publicando la nueva política de privacidad en esta página."
  },
  {
    title: "8. Contacto",
    content: "Si tienes preguntas sobre esta política de privacidad, por favor contáctanos a través de la sección de contacto de la plataforma."
  }
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900/90 to-purple-900/90">
        <div className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')" }}
        />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
            <p className="text-xl opacity-90">
              Última actualización: 15 de Marzo, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-8">
                    En CastingApp, nos tomamos muy en serio la privacidad de nuestros usuarios.
                    Esta política de privacidad describe cómo recopilamos, usamos y protegemos tu información personal.
                  </p>

                  {sections.map((section, index) => (
                    <div key={index} className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                      <p className="text-muted-foreground">{section.content}</p>
                    </div>
                  ))}

                  <div className="mt-12 p-4 bg-muted/40 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Al utilizar CastingApp, aceptas las prácticas descritas en esta política de privacidad.
                      Si no estás de acuerdo con esta política, por favor no utilices nuestra plataforma.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
} 