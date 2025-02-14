import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<'initial' | 'sending' | 'sent' | 'error'>('initial');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      if (token) {
        // Reset password with token
        // await resetPassword(token, newPassword);
        navigate('/login');
      } else {
        // Request password reset
        // await requestPasswordReset(email);
        setStatus('sent');
      }
    } catch (err) {
      setStatus('error');
      setError('Failed to process request');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" gutterBottom>
            {token ? 'Reset Password' : 'Forgot Password'}
          </Typography>

          {status === 'sent' && !token && (
            <Alert severity="success" sx={{ mb: 2 }}>
              If an account exists with that email, you will receive password reset instructions.
            </Alert>
          )}

          {status === 'error' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {token ? (
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            ) : (
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={status === 'sending'}
            >
              {token ? 'Reset Password' : 'Send Reset Link'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PasswordReset;
