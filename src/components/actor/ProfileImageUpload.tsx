import { useState } from 'react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase/client';
import { useToast } from '../ui/use-toast';
import { Upload, X } from 'lucide-react';

interface ProfileImageUploadProps {
  actorId: string;
  onUploadComplete: (url: string) => void;
}

export function ProfileImageUpload({ actorId, onUploadComplete }: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Crear la ruta del archivo en el bucket
      const filePath = `${actorId}/profile/${file.name}`;

      // Subir el archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('actor_media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Obtener la URL pública del archivo
      const { data: { publicUrl } } = supabase.storage
        .from('actor_media')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      
      toast({
        title: "Imagen subida exitosamente",
        description: "Tu imagen de perfil ha sido actualizada.",
      });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      toast({
        title: "Error al subir la imagen",
        description: "Hubo un problema al subir tu imagen. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="relative"
          disabled={isUploading}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Subiendo...' : 'Subir imagen de perfil'}
        </Button>
      </div>
    </div>
  );
} 