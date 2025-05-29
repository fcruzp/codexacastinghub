import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

interface VideoUploadProps {
  onSuccess?: () => void;
}

export function VideoUpload({ onSuccess }: VideoUploadProps) {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No hay usuario autenticado");

      // Subir video a Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("actor-videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública del video
      const { data: { publicUrl } } = supabase.storage
        .from("actor-videos")
        .getPublicUrl(filePath);

      // Actualizar perfil del actor con la URL del video
      const { error: updateError } = await supabase
        .from("actor_profiles")
        .upsert({
          user_id: user.id,
          video_url: publicUrl,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      setVideoUrl(publicUrl);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al subir video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="video">Video de Demostración</Label>
        <input
          id="video"
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          disabled={loading}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => document.getElementById("video")?.click()}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Subiendo..." : "Subir Video"}
        </Button>
      </div>

      {videoUrl && (
        <div className="aspect-video">
          <video
            src={videoUrl}
            controls
            className="w-full h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
} 