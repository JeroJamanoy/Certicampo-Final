import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { CultivesProvider } from "./context/CultivesContext";
import MenuPrincipal from "./components/MenuPrincipal";
import Inicio from './pages/Inicio';
import LoginPage from './pages/LoginPage';
import RegistroCultivos from './pages/RegistroCultivos/RegistroCultivos';
import Certificados from './pages/Certificados/Certificados';
import Foro from './pages/Foro/Foro';
import Perfil from './pages/Perfil/Perfil';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CultivesProvider>
        <Router>
          <div className="App">
            <MenuPrincipal />
            <Routes>
              {/* Ruta pública de login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Rutas protegidas */}
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<Navigate to="/inicio" replace />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/registro-cultivos" element={<RegistroCultivos />} />
                <Route path="/certificados" element={<Certificados />} />
                <Route path="/foro" element={<Foro />} />
                <Route path="/perfil" element={<Perfil />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </CultivesProvider>
    </AuthProvider>
  );
}

export default App;
