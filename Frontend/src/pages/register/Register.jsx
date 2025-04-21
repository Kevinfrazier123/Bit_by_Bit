// src/pages/register/Register.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      dispatch({ type: 'REGISTER_FAILURE', payload: { message: 'Passwords do not match' } });
      return;
    }
    dispatch({ type: 'REGISTER_START' });
    try {
      const res = await axios.post('/auth/register', form);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      navigate('/login');
    } catch (err) {
      dispatch({ type: 'REGISTER_FAILURE', payload: err.response?.data || { message: err.message } });
    }
  };

  return (
    <div className="registerPage">
      <form className="registerForm" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering…' : 'Register'}
        </button>

        {error && <p className="errorMessage">{error.message}</p>}
      </form>
    </div>
  );
}