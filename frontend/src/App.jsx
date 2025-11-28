import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import VehicleDetails from "./pages/VehicleDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NewVehicle from "./pages/NewVehicle";
import EditVehicle from "./pages/EditVehicle";
import Login from "./pages/Login"; // nova página de login
import { AuthProvider } from "./auth/AuthContext"; // contexto de autenticação
import ProtectedRoute from "./auth/ProtectedRoute"; // rota protegida
import Register from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-black min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-grow bg-black">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/veiculo/:id" element={<VehicleDetails />} />
              <Route path="/vehicles/:id" element={<VehicleDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* rota protegida: apenas ADMIN pode acessar */}
              <Route
                path="/vehicles/new"
                element={
                  <ProtectedRoute role="ADMIN">
                    <NewVehicle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vehicles/:id/edit"
                element={
                  <ProtectedRoute role="ADMIN">
                    <EditVehicle />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
