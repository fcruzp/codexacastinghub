import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/providers/theme-provider";
import { Toaster } from "./components/ui/toaster";
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

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
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
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App; 