import React, { useState } from 'react';
import './Registro.css';

const Registro = ({ onRegistroExitoso }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido.';
      isValid = false;
    }

    if (!formData.correo.trim()) {
      errors.correo = 'El correo electrónico es requerido.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.correo = 'El correo electrónico no es válido.';
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = 'La contraseña es requerida.';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres.';
      isValid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:3000/registro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            correo: formData.correo,
            password: formData.password,
          }),
        });

        if (response.ok) {
          console.log('Registro exitoso');
          onRegistroExitoso();
        } else {
          console.log('Error al registrar');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('El formulario contiene errores. No se puede enviar.');
    }
  };

  return (
    <div className="registro-form">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} method="POST">
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" name="nombre" onChange={handleInputChange} value={formData.nombre} required />
          {errors.nombre && <div className="error-message">{errors.nombre}</div>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="correo" onChange={handleInputChange} value={formData.correo} required />
          {errors.correo && <div className="error-message">{errors.correo}</div>}
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input type="password" name="password" onChange={handleInputChange} value={formData.password} required />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label>Confirmar Contraseña:</label>
          <input type="password" name="confirmPassword" onChange={handleInputChange} value={formData.confirmPassword} required />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Registro;

