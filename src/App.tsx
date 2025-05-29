import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import Home from "./page";
import Login from "./auth/login";
import Register from "./auth/register";
import Browse from "./pages/browse";
import About from "./pages/about";
import ActorProfile from "./actor/profile";
import CastingProfile from "./casting/profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ExploreActors from "./explore/actors";
import Profile from "./pages/profile";
import Welcome from "@/pages/welcome";
import Landing from "@/pages/landing";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes";

// Componente Layout
function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Rutas públicas sin layout */}
            <Route path="/" element={<Welcome />} />
            <Route path="/landing" element={<Landing />} />

            {/* Rutas de autenticación sin layout */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Rutas con layout */}
            <Route element={<Layout />}>
              <Route path="/page" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/about" element={<About />} />
              
              {/* Rutas protegidas para actores */}
              <Route
                path="/actor/profile"
                element={
                  <ProtectedRoute requiredUserType="actor">
                    <ActorProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* Rutas protegidas para casting */}
              <Route
                path="/casting/profile"
                element={
                  <ProtectedRoute requiredUserType="casting">
                    <CastingProfile />
                  </ProtectedRoute>
                }
              />

              {/* Ruta para explorar actores (solo directores) */}
              <Route
                path="/explore/actors"
                element={
                  <ProtectedRoute requiredUserType="director">
                    <ExploreActors />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 