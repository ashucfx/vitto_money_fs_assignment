import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/client';
import toast from 'react-hot-toast';

export default function Login() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin) {
      toast.error('Please enter the agent PIN.');
      return;
    }

    setLoading(true);
    try {
      const response = await login(pin);
      if (response.data.success) {
        localStorage.setItem('agent_token', response.data.data.token);
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Invalid PIN.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <h2 className="login-title">Agent Portal Login</h2>
        <p className="login-subtitle">Enter your secure PIN to access operations</p>
        
        <form onSubmit={handleSubmit} className="form-group">
          <label>Agent PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter 6-digit PIN"
            maxLength={6}
            autoFocus
            className="input-field"
            style={{ letterSpacing: '0.5em', textAlign: 'center' }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
