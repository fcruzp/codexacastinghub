import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { Youtube, Plus, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { supabase } from '../../lib/supabase/client';

interface YouTubeLinksProps {
  actorId: string;
  onLinksUpdate: (links: string[]) => void;
}

export function YouTubeLinks({ actorId, onLinksUpdate }: YouTubeLinksProps) {
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadExistingLinks();
  }, [actorId]);

  const loadExistingLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('actor_profiles')
        .select('youtube_links')
        .eq('id', actorId)
        .single();

      if (error) throw error;

      if (data?.youtube_links) {
        const existingLinks = Array.isArray(data.youtube_links) 
          ? data.youtube_links 
          : [data.youtube_links];
        setLinks(existingLinks.filter(Boolean));
      }
    } catch (error) {
      console.error('Error al cargar enlaces de YouTube:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los enlaces de YouTube.",
        variant: "destructive",
      });
    }
  };

  const validateYouTubeUrl = (url: string) => {
    // Patrones comunes de URLs de YouTube, incluyendo parámetros adicionales
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(\?.*)?$/,
      /^(https?:\/\/)?(www\.)?(youtu\.be\/)([a-zA-Z0-9_-]{11})(\?.*)?$/,
      /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\?.*)?$/,
      /^(https?:\/\/)?(www\.)?(youtube\.com\/v\/)([a-zA-Z0-9_-]{11})(\?.*)?$/,
      /^(https?:\/\/)?(www\.)?(youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})(\?.*)?$/
    ];

    return patterns.some(pattern => pattern.test(url));
  };

  const formatYouTubeUrl = (url: string) => {
    // Eliminar espacios al inicio y final
    url = url.trim();
    
    // Si la URL no tiene el protocolo, agregarlo
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    // Extraer el ID del video y eliminar parámetros adicionales
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('/').pop()?.split('?')[0] || '';
    } else if (url.includes('youtube.com')) {
      const match = url.match(/[?&]v=([^&]+)/);
      videoId = match ? match[1] : '';
    }

    if (videoId) {
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    return url;
  };

  const handleAddLink = async () => {
    if (!newLink.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un enlace de YouTube.",
        variant: "destructive",
      });
      return;
    }

    const formattedUrl = formatYouTubeUrl(newLink.trim());
    
    if (!validateYouTubeUrl(formattedUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor, ingresa una URL válida de YouTube. Ejemplos:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const updatedLinks = [...links, formattedUrl];
      setLinks(updatedLinks);
      setNewLink('');
      await onLinksUpdate(updatedLinks);
      
      toast({
        title: "Enlace agregado",
        description: "El enlace de YouTube ha sido agregado a tu perfil.",
      });
    } catch (error) {
      setLinks(links);
      console.error('Error al agregar enlace:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el enlace de YouTube.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveLink = async (index: number) => {
    setIsUpdating(true);
    try {
      const newLinks = links.filter((_, i) => i !== index);
      setLinks(newLinks);
      await onLinksUpdate(newLinks);
      
      toast({
        title: "Enlace eliminado",
        description: "El enlace de YouTube ha sido eliminado de tu perfil.",
      });
    } catch (error) {
      setLinks(links);
      console.error('Error al eliminar enlace:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el enlace de YouTube.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="url"
          placeholder="Pega aquí el enlace de tu video de YouTube"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          className="flex-1"
          disabled={isUpdating}
        />
        <Button
          variant="outline"
          onClick={handleAddLink}
          className="whitespace-nowrap"
          disabled={isUpdating || !newLink.trim()}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isUpdating ? 'Actualizando...' : 'Agregar enlace'}
        </Button>
      </div>

      {/* Lista de enlaces */}
      <div className="grid gap-4">
        {links.map((link, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-600" />
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {link}
                </a>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveLink(index)}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 