import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ActorLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
} 