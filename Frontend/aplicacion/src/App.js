import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Registro from './Registro';
import InicioSesion from './InicioSesion';
import Pagina1 from './pagina1';
import Formulario from './Formulario';
import Editar from './editar';
import FormularioEdicion from './editar';

const App = () => {
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [formularioExitoso, setFormularioExitoso] = useState(false);
   // Obtiene la función de navegación usando useNavigate
  
 
  const handleRegistroExitoso = () => {
    // Actualiza el estado para indicar que el registro fue exitoso
    setRegistroExitoso(true);
  };

  const handleFormularioSuccess = () => {
    console.log('Datos insertados correctamente');
    // Actualiza el estado para indicar que el formulario fue enviado exitosamente
    setFormularioExitoso(true);
  };

  // Esta función se pasa como prop a InicioSesion
  const handleLoginSuccess = () => {
    // Lógica para manejar el inicio de sesión exitoso
    console.log('Inicio de sesión exitoso');
    // Aquí puedes redirigir a la página deseada
  };

  return (
    <Router>
      <div className="container mt-5">
        <Routes>
          <Route path="/registro" element={registroExitoso ? <Navigate to="/login" /> : <Registro onRegistroExitoso={handleRegistroExitoso} />} />
          {/* Pasa la función handleLoginSuccess como prop a InicioSesion */}
          <Route path="/login" element={<InicioSesion onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/pagina1" element={<Pagina1 />} />
          <Route path="/formulario" element={<Formulario onSuccess={() => window.location.href = '/pagina1'} />} />
          <Route path="/editar/:id" element={<FormularioEdicion />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;





