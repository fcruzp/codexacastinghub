import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase/client';
import { useToast } from '../ui/use-toast';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Download
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GalleryUploadProps {
  onUploadComplete: (urls: string[]) => Promise<void>;
}

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes
const ZOOM_STEP = 0.25;
const MAX_ZOOM = 3;
const MIN_ZOOM = 0.5;
const STORAGE_BUCKET = 'actor_media';
const STORAGE_PATH = 'gallery';

interface PreviewImage {
  file: File;
  preview: string;
}

export function GalleryUpload({ onUploadComplete }: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Limpiar las URLs de previsualización cuando el componente se desmonte
  useEffect(() => {
    return () => {
      previewImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [previewImages]);

  // Función para cargar las imágenes existentes
  const loadExistingImages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay usuario autenticado");

      console.log("Buscando imágenes en storage para usuario:", user.id);
      
      // Listar archivos en la carpeta del usuario/gallery
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(`${user.id}/gallery`);

      if (error) {
        console.error("Error al listar archivos del storage:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No se encontraron imágenes en storage");
        return;
      }

      console.log("Archivos encontrados en storage:", data);

      const imageUrls = await Promise.all(
        data.map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(`${user.id}/gallery/${file.name}`);
          console.log("URL generada para:", file.name, publicUrl);
          return publicUrl;
        })
      );

      console.log("URLs generadas:", imageUrls);

      if (imageUrls.length > 0) {
        setImages(imageUrls);
      }
    } catch (error) {
      console.error('Error al cargar las imágenes:', error);
      toast({
        title: "Error al cargar la galería",
        description: "No se pudieron cargar las imágenes existentes.",
        variant: "destructive",
      });
    }
  };

  // Usar useCallback para evitar recreaciones innecesarias de la función
  const loadImagesCallback = useCallback(loadExistingImages, []);

  // Usar useEffect con dependencias correctas
  useEffect(() => {
    loadImagesCallback();
  }, [loadImagesCallback]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('actor-gallery')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('actor-gallery')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      await onUploadComplete(uploadedUrls);
      setSelectedFiles([]);
      toast({
        title: "Éxito",
        description: "Imágenes subidas correctamente",
      });
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      toast({
        title: "Error",
        description: "Error al subir las imágenes",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No hay usuario autenticado");

      // Extraer el nombre del archivo de la URL
      const fileName = imageUrl.split("/").pop();
      if (!fileName) return;

      // Corregir la ruta para que coincida con la estructura del bucket
      const filePath = `${user.id}/gallery/${fileName}`;

      // Eliminar imagen del storage
      const { error: deleteError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (deleteError) throw deleteError;

      setImages(prev => prev.filter(url => url !== imageUrl));
      
      toast({
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada de tu galería.",
      });

      if (onUploadComplete) {
        await onUploadComplete(images.filter(url => url !== imageUrl));
      }
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      toast({
        title: "Error al eliminar imagen",
        description: "No se pudo eliminar la imagen. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(prev => prev + 1);
      setSelectedImage(images[selectedImageIndex + 1]);
      setZoom(1);
      setRotation(0);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(prev => prev - 1);
      setSelectedImage(images[selectedImageIndex - 1]);
      setZoom(1);
      setRotation(0);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedImage) return;
    
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = selectedImage.split('/').pop() || 'imagen';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      toast({
        title: "Error al descargar",
        description: "No se pudo descargar la imagen. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedImage) return;

    switch (e.key) {
      case 'ArrowLeft':
        handlePrevImage();
        break;
      case 'ArrowRight':
        handleNextImage();
        break;
      case 'Escape':
        setSelectedImage(null);
        setSelectedImageIndex(-1);
        break;
      case '+':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case 'r':
        handleRotate();
        break;
    }
  };

  useEffect(() => {
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  const handleImageClick = (url: string, index: number) => {
    setSelectedImage(url);
    setSelectedImageIndex(index);
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Galería de Fotos</h3>
          <p className="text-sm text-muted-foreground">
            Sube hasta {MAX_IMAGES} imágenes (solo JPG o PNG, máximo 10MB cada una)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || images.length >= MAX_IMAGES}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Subiendo..." : "Subir Imágenes"}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No hay imágenes</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sube algunas imágenes para mostrar en tu perfil
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                onClick={() => handleImageClick(url, index)}
              />
              <button
                onClick={() => handleRemoveImage(url)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Diálogo de visualización de imagen */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Imagen seleccionada"
                  className="w-full h-[600px] object-contain"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease-in-out'
                  }}
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevImage}
                    disabled={selectedImageIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextImage}
                    disabled={selectedImageIndex === images.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomOut}
                    disabled={zoom <= MIN_ZOOM}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={zoom >= MAX_ZOOM}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRotate}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 