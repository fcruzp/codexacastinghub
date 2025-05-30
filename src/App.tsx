import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import Home from "./page";
import Welcome from "./pages/welcome";
import Landing from "./pages/landing";
import Login from "./auth/login";
import Register from "./auth/register";
import Browse from "./pages/browse";
import About from "./pages/about";
import Blog from "./pages/blog";
import Support from "./pages/support";
import Contact from "./pages/contact";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import ActorLayout from "./layouts/ActorLayout";
import CastingLayout from "./layouts/CastingLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Explore from "./pages/explore";
import ActorProfile from "./pages/actor/profile";
import CastingProfile from "./pages/casting/profile";
import ViewActorProfile from "./pages/actor/view-profile";

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
            {/* Rutas sin layout */}
            <Route path="/" element={<Welcome />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Rutas con layout */}
            <Route element={<Layout />}>
              <Route path="/page" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/about" element={<About />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/actors/:id" element={<ViewActorProfile />} />
            </Route>
            
            {/* Rutas protegidas para actores */}
            <Route
              path="/actor"
              element={
                <ProtectedRoute requiredUserType="actor">
                  <ActorLayout />
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<ActorProfile />} />
            </Route>

            {/* Rutas protegidas para agentes de casting */}
            <Route
              path="/casting"
              element={
                <ProtectedRoute requiredUserType="casting_agent">
                  <CastingLayout />
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<CastingProfile />} />
            </Route>

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 