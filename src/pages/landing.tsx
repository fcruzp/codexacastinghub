import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900">
            Encuentra tu próximo papel
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conectamos talento con oportunidades en el mundo del espectáculo. 
            Únete a nuestra comunidad de actores y directores.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => navigate('/auth/register')}
              className="px-8 py-6 text-lg"
            >
              Registrarse
            </Button>
            <Button 
              onClick={() => navigate('/auth/login')}
              variant="outline"
              className="px-8 py-6 text-lg"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Para Actores</h3>
              <p className="text-gray-600">
                Crea tu perfil, muestra tu talento y encuentra las mejores oportunidades.
              </p>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Para Directores</h3>
              <p className="text-gray-600">
                Encuentra el talento perfecto para tu próximo proyecto.
              </p>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Para Casting</h3>
              <p className="text-gray-600">
                Gestiona tus audiciones y encuentra el elenco ideal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 