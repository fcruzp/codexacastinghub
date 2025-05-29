import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProfileImageUploadProps {
  onUploadComplete: (url: string) => Promise<void>;
}

export function ProfileImageUpload({ onUploadComplete }: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('actor-profiles')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('actor-profiles')
        .getPublicUrl(filePath);

      await onUploadComplete(publicUrl);
      setSelectedFile(null);
      toast({
        title: "Éxito",
        description: "Imagen de perfil actualizada correctamente",
      });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast({
        title: "Error",
        description: "Error al subir la imagen de perfil",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Cambiar Foto de Perfil</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? "Subiendo..." : "Subir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 