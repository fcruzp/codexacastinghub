import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ImageViewer({ isOpen, onClose, imageUrl }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleClose = () => {
    setZoom(1);
    setRotation(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <DialogTitle className="sr-only">Visor de Imagen</DialogTitle>
        <DialogDescription className="sr-only">
          Visor de imagen con controles para zoom y rotación
        </DialogDescription>
        
        <div className="relative w-full h-full flex items-center justify-center bg-black/90">
          {/* Botón de cerrar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 text-white"
            aria-label="Cerrar visor"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Controles */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomIn}
              className="bg-black/50 hover:bg-black/70"
              aria-label="Acercar imagen"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomOut}
              className="bg-black/50 hover:bg-black/70"
              aria-label="Alejar imagen"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleRotate}
              className="bg-black/50 hover:bg-black/70"
              aria-label="Rotar imagen"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Imagen */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={imageUrl}
              alt="Imagen ampliada"
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 