import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 CastingApp. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
            Acerca de
          </Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
            Términos
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
            Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
} 