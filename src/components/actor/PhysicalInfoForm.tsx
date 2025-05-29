import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";

interface PhysicalInfoFormProps {
  onSuccess?: () => void;
}

export function PhysicalInfoForm({ onSuccess }: PhysicalInfoFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    ethnicity: "",
    height_cm: "",
    weight_kg: "",
    eye_color: "",
    hair_color: "",
    body_type: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No hay usuario autenticado");

      const { error } = await supabase
        .from("actor_profiles")
        .upsert({
          user_id: user.id,
          ...formData,
          height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
          weight_kg: formData.weight_kg ? parseInt(formData.weight_kg) : null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al guardar información física:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="gender">Género</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Femenino</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ethnicity">Etnia</Label>
          <Input
            id="ethnicity"
            name="ethnicity"
            value={formData.ethnicity}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height_cm">Altura (cm)</Label>
          <Input
            id="height_cm"
            name="height_cm"
            type="number"
            value={formData.height_cm}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight_kg">Peso (kg)</Label>
          <Input
            id="weight_kg"
            name="weight_kg"
            type="number"
            value={formData.weight_kg}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eye_color">Color de Ojos</Label>
          <Input
            id="eye_color"
            name="eye_color"
            value={formData.eye_color}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hair_color">Color de Cabello</Label>
          <Input
            id="hair_color"
            name="hair_color"
            value={formData.hair_color}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body_type">Tipo de Cuerpo</Label>
          <Select
            value={formData.body_type}
            onValueChange={(value) => handleSelectChange("body_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de cuerpo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="athletic">Atlético</SelectItem>
              <SelectItem value="average">Promedio</SelectItem>
              <SelectItem value="slim">Delgado</SelectItem>
              <SelectItem value="muscular">Musculoso</SelectItem>
              <SelectItem value="curvy">Curvilíneo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar Información Física"}
      </Button>
    </form>
  );
} 