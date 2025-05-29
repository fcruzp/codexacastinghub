import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase/client';
import { useToast } from '../ui/use-toast';
import { Upload, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface ProfilePhotoUploadProps {
  actorId: string;
  currentPhotoUrl?: string;
  onPhotoUpdate: (newUrl: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes

export function ProfilePhotoUpload({ actorId, currentPhotoUrl, onPhotoUpdate }: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Archivo demasiado grande",
        description: "La imagen no debe superar los 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Crear previsualización
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    try {
      setIsUploading(true);
      const file = fileInputRef.current.files[0];
      const filePath = `${actorId}/profile_photo`;

      // Subir el archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('actor_media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obtener la URL pública del archivo
      const { data: { publicUrl } } = supabase.storage
        .from('actor_media')
        .getPublicUrl(filePath);

      // Actualizar la URL en el componente padre
      onPhotoUpdate(publicUrl);
      
      toast({
        title: "Foto de perfil actualizada",
        description: "Tu foto de perfil ha sido actualizada exitosamente.",
      });

      // Limpiar previsualización
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error al subir la foto de perfil:', error);
      toast({
        title: "Error al actualizar la foto",
        description: "Hubo un problema al actualizar tu foto de perfil. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="relative"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Subiendo...' : 'Cambiar foto de perfil'}
        </Button>
      </div>

      {previewUrl && (
        <Card>
          <CardContent className="p-4">
            <div className="relative aspect-square max-w-[200px] mx-auto">
              <img
                src={previewUrl}
                alt="Previsualización"
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? 'Subiendo...' : 'Confirmar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentPhotoUrl && !previewUrl && (
        <Card>
          <CardContent className="p-4">
            <div className="relative aspect-square max-w-[200px] mx-auto">
              <img
                src={currentPhotoUrl}
                alt="Foto de perfil actual"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 