import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Container,
  Button,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const { user, sendVerificationEmail } = useAuth();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setStatus('sending');
    try {
      await sendVerificationEmail(user.email);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError('Failed to send verification email');
    }
  };

  if (!user) return null;

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Email Verification Required
          </Typography>
          
          {user.emailVerified ? (
            <Alert severity="success">
              Your email has been verified!
            </Alert>
          ) : (
            <>
              <Typography paragraph>
                Please verify your email address ({user.email}) to continue using all features.
              </Typography>

              {status === 'sent' && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Verification email has been sent!
                </Alert>
              )}

              {status === 'error' && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={handleResendVerification}
                disabled={status === 'sending'}
                startIcon={status === 'sending' ? <CircularProgress size={20} /> : null}
              >
                Resend Verification Email
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification;
