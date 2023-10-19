import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './InicioSesion.css';

const InicioSesion = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });

  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: formData.correo,
          password: formData.password,
        }),
      });

      if (response.ok) {
        console.log('Inicio de sesión exitoso');
        onLoginSuccess();
        setLoginSuccess(true);
      } else {
        console.log('Inicio de sesión fallido');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

   // Si el inicio de sesión es exitoso, redirige a la página1
   if (loginSuccess) {
    return <Navigate to="/pagina1" />;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo:</label>
          <input type="email" className="form-control" id="email" name="correo" onChange={handleInputChange} value={formData.correo} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña:</label>
          <input type="password" className="form-control" id="password" name="password" onChange={handleInputChange} value={formData.password} required />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default InicioSesion;
