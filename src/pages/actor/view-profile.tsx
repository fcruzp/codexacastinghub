import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Youtube } from "lucide-react";
import { ImageViewer } from "@/components/ui/image-viewer";

interface ActorProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  stage_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  ethnicity: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  eye_color: string | null;
  hair_color: string | null;
  languages: string[] | null;
  skills: string[] | null;
  biography: string | null;
  location_city: string | null;
  location_country: string | null;
  contact_phone: string | null;
  agent_contact_email: string | null;
  profile_image_url: string | null;
  youtube_links: string[] | null;
  gallery_urls: string[] | null;
  updated_at: string | null;
}

export default function ViewActorProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ActorProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  // Suscribirse a cambios en la autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/page');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const loadProfile = async () => {
    try {
      if (!id) {
        throw new Error("ID de actor no proporcionado");
      }

      const { data, error } = await supabase
        .from("actor_profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Obtener las imágenes de la galería
      const { data: galleryData, error: galleryError } = await supabase.storage
        .from('actor_media')
        .list(`${id}/gallery`);

      if (galleryError) {
        console.error("Error al cargar la galería:", galleryError);
      }

      // Construir las URLs públicas para cada imagen
      const galleryUrls = galleryData?.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('actor_media')
          .getPublicUrl(`${id}/gallery/${file.name}`);
        return publicUrl;
      }) || [];

      setProfile({
        ...data,
        gallery_urls: galleryUrls
      });
    } catch (err) {
      console.error("Error al cargar perfil:", err);
      setError(err instanceof Error ? err.message : "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error || "No se pudo cargar el perfil"}</p>
          <Button onClick={() => navigate("/explore")} className="mt-4">
            Volver a Explorar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/explore")}>
          ← Volver a Explorar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna izquierda - Información básica */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={`${profile.first_name || ''} ${profile.last_name || ''}`}
                    className="w-48 h-48 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center mb-4">
                    <span className="text-4xl">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </span>
                  </div>
                )}
                <h2 className="text-2xl font-bold text-center">
                  {profile.stage_name || `${profile.first_name || ''} ${profile.last_name || ''}`}
                </h2>
                {profile.location_city && profile.location_country && (
                  <div className="flex items-center text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.location_city}, {profile.location_country}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {profile.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{profile.contact_phone}</span>
                  </div>
                )}
                {profile.agent_contact_email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{profile.agent_contact_email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Detalles */}
        <div className="md:col-span-2">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="physical">Características</TabsTrigger>
              <TabsTrigger value="media">Multimedia</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.biography && (
                    <div>
                      <h3 className="font-semibold mb-2">Biografía</h3>
                      <p className="text-muted-foreground">{profile.biography}</p>
                    </div>
                  )}

                  {profile.languages && profile.languages.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Idiomas</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((lang, index) => (
                          <Badge key={index} variant="secondary">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Habilidades</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="physical">
              <Card>
                <CardHeader>
                  <CardTitle>Características Físicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {profile.height_cm && (
                      <div>
                        <h3 className="font-semibold">Altura</h3>
                        <p className="text-muted-foreground">{profile.height_cm} cm</p>
                      </div>
                    )}
                    {profile.weight_kg && (
                      <div>
                        <h3 className="font-semibold">Peso</h3>
                        <p className="text-muted-foreground">{profile.weight_kg} kg</p>
                      </div>
                    )}
                    {profile.gender && (
                      <div>
                        <h3 className="font-semibold">Género</h3>
                        <p className="text-muted-foreground">{profile.gender}</p>
                      </div>
                    )}
                    {profile.ethnicity && (
                      <div>
                        <h3 className="font-semibold">Etnia</h3>
                        <p className="text-muted-foreground">{profile.ethnicity}</p>
                      </div>
                    )}
                    {profile.eye_color && (
                      <div>
                        <h3 className="font-semibold">Color de Ojos</h3>
                        <p className="text-muted-foreground">{profile.eye_color}</p>
                      </div>
                    )}
                    {profile.hair_color && (
                      <div>
                        <h3 className="font-semibold">Color de Cabello</h3>
                        <p className="text-muted-foreground">{profile.hair_color}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Multimedia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Galería de Imágenes */}
                  {profile.gallery_urls && profile.gallery_urls.length > 0 ? (
                    <div>
                      <h3 className="font-semibold mb-4">Galería de Imágenes</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {profile.gallery_urls.map((url, index) => (
                          <div 
                            key={index} 
                            className="relative aspect-square cursor-pointer group"
                            onClick={() => setSelectedImage(url)}
                          >
                            <img
                              src={url}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay imágenes en la galería</p>
                  )}

                  {/* Enlaces de YouTube */}
                  {profile.youtube_links && profile.youtube_links.length > 0 ? (
                    <div>
                      <h3 className="font-semibold mb-4">Enlaces de YouTube</h3>
                      <div className="space-y-4">
                        {profile.youtube_links.map((link, index) => (
                          <div key={index} className="flex items-center">
                            <Youtube className="w-4 h-4 mr-2" />
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {link}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay enlaces de YouTube disponibles</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Visor de Imágenes */}
      <ImageViewer
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
      />
    </div>
  );
} 