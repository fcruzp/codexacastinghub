import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";

interface ExperienceFormProps {
  onSuccess?: () => void;
}

export function ExperienceForm({ onSuccess }: ExperienceFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skills: "",
    languages: "",
    experience: "",
    training: "",
    awards: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No hay usuario autenticado");

      // Convertir strings a arrays
      const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
      const languagesArray = formData.languages.split(",").map(l => l.trim()).filter(Boolean);

      const { error } = await supabase
        .from("actor_profiles")
        .upsert({
          user_id: user.id,
          skills: skillsArray,
          languages: languagesArray,
          experience: formData.experience,
          training: formData.training,
          awards: formData.awards,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al guardar experiencia:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="skills">Habilidades (separadas por comas)</Label>
        <Input
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Ej: Danza, Canto, Teatro, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="languages">Idiomas (separados por comas)</Label>
        <Input
          id="languages"
          name="languages"
          value={formData.languages}
          onChange={handleChange}
          placeholder="Ej: Español, Inglés, Francés, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Experiencia</Label>
        <Textarea
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          rows={4}
          placeholder="Describe tu experiencia en el mundo del espectáculo..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="training">Formación</Label>
        <Textarea
          id="training"
          name="training"
          value={formData.training}
          onChange={handleChange}
          rows={4}
          placeholder="Describe tu formación y estudios..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="awards">Premios y Reconocimientos</Label>
        <Textarea
          id="awards"
          name="awards"
          value={formData.awards}
          onChange={handleChange}
          rows={4}
          placeholder="Lista tus premios y reconocimientos..."
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar Experiencia"}
      </Button>
    </form>
  );
} 