import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ui/use-toast';
import { supabase } from '../lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { VideoUpload } from '../components/actor/VideoUpload';
import { GalleryUpload } from '../components/actor/GalleryUpload';
import { PersonalInfoForm } from '../components/actor/PersonalInfoForm';
import { PhysicalInfoForm } from '../components/actor/PhysicalInfoForm';
import { ExperienceForm } from '../components/actor/ExperienceForm';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  age: number;
  height: number;
  weight: number;
  languages: string[];
  experience: string;
  skills: string[];
  photo_url: string;
  youtube_links: string[];
  updated_at: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
      return;
    }
    loadProfile();
  };

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      const { data: actorProfile, error: actorError } = await supabase
        .from('actors')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: actorProfiles, error: profilesError } = await supabase
        .from('actor_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const data = actorProfiles || actorProfile;
      const error = profilesError || actorError;

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Perfil no encontrado');
      }

      const profileData = {
        ...data,
        languages: typeof data.languages === 'string' 
          ? data.languages.split(',').filter(Boolean)
          : data.languages || [],
        youtube_links: Array.isArray(data.youtube_links) 
          ? data.youtube_links 
          : data.youtube_links ? [data.youtube_links] : []
      };

      setProfile(profileData);
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      toast({
        title: "Error al cargar el perfil",
        description: "No se pudo cargar tu perfil. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
    toast({
      title: "Cambios guardados",
      description: "Tu perfil ha sido actualizado exitosamente.",
    });
  };

  const handleGalleryUpdate = async (urls: string[]) => {
    try {
      // Implementar la lógica de actualización de galería
      console.log('URLs de galería actualizadas:', urls);
    } catch (error) {
      console.error('Error al actualizar la galería:', error);
    }
  };

  if (!profile) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="physical">Características Físicas</TabsTrigger>
              <TabsTrigger value="experience">Experiencia</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="gallery">Galería</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <PersonalInfoForm onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="physical" className="mt-6">
              <PhysicalInfoForm onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="experience" className="mt-6">
              <ExperienceForm onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="video" className="mt-6">
              <VideoUpload onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <GalleryUpload onUploadComplete={handleGalleryUpdate} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 