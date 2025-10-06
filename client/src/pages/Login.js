import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FiBarChart2, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button, Input, LoadingSpinner } from '../styles/GlobalStyle';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: ${props => props.theme.shadows.xl};
  animation: fadeIn 0.5s ease-out;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};

  svg {
    font-size: 2rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-size: 1.875rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.textMuted};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${props => props.theme.borderRadius.sm};

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.error}10;
  color: ${props => props.theme.colors.error};
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  border: 1px solid ${props => props.theme.colors.error}20;
`;

const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.success}10;
  color: ${props => props.theme.colors.success};
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  border: 1px solid ${props => props.theme.colors.success}20;
`;

const LoginButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
  height: 3rem;
  font-size: 1rem;
  font-weight: 600;
`;

const DemoCredentials = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const DemoTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;
`;

const DemoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const DemoButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    opacity: 0.9;
  }
`;

const Login = () => {
  const { user, login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si ya está autenticado, redirigir al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <FiBarChart2 />
          Analytics Pro
        </Logo>
        
        <Title>Bienvenido</Title>
        <Subtitle>Inicia sesión en tu dashboard de analytics</Subtitle>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Contraseña</Label>
            <PasswordContainer>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                required
                disabled={isSubmitting}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </PasswordContainer>
          </FormGroup>

          <LoginButton
            type="submit"
            variant="primary"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <>
                <LoadingSpinner size="16px" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </LoginButton>
        </Form>

        <DemoCredentials>
          <DemoTitle>Credenciales de Demo</DemoTitle>
          <DemoItem>
            <span>👨‍💼 Administrador</span>
            <DemoButton onClick={() => fillDemoCredentials('admin@dashboard.com', 'admin123')}>
              Usar
            </DemoButton>
          </DemoItem>
          <DemoItem>
            <span>👤 Usuario</span>
            <DemoButton onClick={() => fillDemoCredentials('user@dashboard.com', 'user123')}>
              Usar
            </DemoButton>
          </DemoItem>
        </DemoCredentials>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
