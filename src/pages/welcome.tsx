import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight">
          Bienvenido a Casting
        </h1>
        <p className="text-xl text-gray-300">
          Tu plataforma para conectar con las mejores oportunidades en el mundo del espectáculo
        </p>
        <Button 
          onClick={() => navigate('/page')}
          className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg"
        >
          Comenzar
        </Button>
      </div>
    </div>
  );
} 