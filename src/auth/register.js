import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [Nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isFormValid = () => {
    return Nama.trim() !== '' && username.trim() !== '' && password.trim() !== '';
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        Nama: Nama,
        username: username,
        password: password,
      });
      console.log('Pendaftaran berhasil:', response.data);
      navigate('/');
      // Jangan gunakan window.location.reload() secara langsung, tetapi perbarui state atau berikan umpan balik yang sesuai kepada pengguna
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      console.error('Gagal mendaftar:', errorMessage);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-5">Form Pendaftaran</h2>
      <div className="form-group">
        <label>Username:</label>
        <input className="form-control" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input className="form-control" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary mt-2" onClick={handleRegister}>
        {' '}
        Daftar{' '}
      </button>
    </div>
  );
}

export default Register;
