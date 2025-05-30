import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    title: "1. Aceptación de los Términos",
    content: "Al acceder y utilizar CastingApp, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder a la plataforma."
  },
  {
    title: "2. Descripción del Servicio",
    content: "CastingApp es una plataforma que conecta actores con directores de casting. Proporcionamos herramientas para la creación de perfiles, gestión de proyectos y comunicación entre usuarios."
  },
  {
    title: "3. Cuentas de Usuario",
    content: "Los usuarios deben proporcionar información precisa y actualizada al crear su cuenta. Cada usuario es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades que ocurran bajo su cuenta."
  },
  {
    title: "4. Contenido del Usuario",
    content: "Los usuarios mantienen sus derechos sobre el contenido que suben a la plataforma, pero otorgan a CastingApp una licencia no exclusiva para usar, modificar y distribuir dicho contenido en relación con el servicio."
  },
  {
    title: "5. Conducta del Usuario",
    content: "Los usuarios acuerdan no utilizar la plataforma para fines ilegales o no autorizados. No se permite el acoso, la discriminación o cualquier comportamiento que pueda dañar a otros usuarios."
  },
  {
    title: "6. Propiedad Intelectual",
    content: "Todo el contenido y materiales disponibles en CastingApp, incluyendo pero no limitado a textos, gráficos, logotipos, iconos, imágenes y software, son propiedad de CastingApp o sus licenciantes."
  },
  {
    title: "7. Limitación de Responsabilidad",
    content: "CastingApp no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, o cualquier pérdida de beneficios o ingresos."
  },
  {
    title: "8. Modificaciones del Servicio",
    content: "CastingApp se reserva el derecho de modificar o discontinuar el servicio en cualquier momento, con o sin previo aviso."
  },
  {
    title: "9. Ley Aplicable",
    content: "Estos términos se regirán e interpretarán de acuerdo con las leyes del país donde CastingApp tiene su sede principal."
  },
  {
    title: "10. Contacto",
    content: "Para cualquier consulta sobre estos términos, por favor contacta a nuestro equipo de soporte a través de la sección de contacto de la plataforma."
  }
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900/90 to-purple-900/90">
        <div className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')" }}
        />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Términos y Condiciones</h1>
            <p className="text-xl opacity-90">
              Última actualización: 15 de Marzo, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-8">
                    Bienvenido a CastingApp. Estos términos y condiciones rigen tu uso de nuestra plataforma.
                    Por favor, léelos cuidadosamente antes de utilizar nuestros servicios.
                  </p>

                  {sections.map((section, index) => (
                    <div key={index} className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                      <p className="text-muted-foreground">{section.content}</p>
                    </div>
                  ))}

                  <div className="mt-12 p-4 bg-muted/40 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Al utilizar CastingApp, aceptas estos términos y condiciones en su totalidad.
                      Si no estás de acuerdo con estos términos y condiciones o alguna parte de estos términos y condiciones,
                      no debes utilizar nuestra plataforma.
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