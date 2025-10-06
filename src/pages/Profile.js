import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  FiUser, 
  FiMail, 
  FiSettings, 
  FiSave,
  FiEye,
  FiEyeOff,
  FiMoon,
  FiSun,
  FiBell
} from 'react-icons/fi';
import { Card, Button, Input, LoadingSpinner } from '../styles/GlobalStyle';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
`;

const UserRole = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  display: inline-block;
  background: ${props => {
    switch (props.role) {
      case 'admin': return `${props.theme.colors.error}15`;
      case 'user': return `${props.theme.colors.primary}15`;
      default: return `${props.theme.colors.secondary}15`;
    }
  }};
  color: ${props => {
    switch (props.role) {
      case 'admin': return props.theme.colors.error;
      case 'user': return props.theme.colors.primary;
      default: return props.theme.colors.secondary;
    }
  }};
`;

const UserEmail = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.5rem 0 0 0;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;

  svg {
    color: ${props => props.theme.colors.primary};
  }
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

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
`;

const SwitchLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.theme.colors.border};
    transition: ${props => props.theme.transitions.fast};
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: ${props => props.theme.transitions.fast};
      border-radius: 50%;
    }
  }

  input:checked + .slider {
    background-color: ${props => props.theme.colors.primary};
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }
`;

const SaveButton = styled(Button)`
  align-self: flex-start;
`;

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [preferences, setPreferences] = useState({
    theme: user?.preferences?.theme || 'light',
    language: user?.preferences?.language || 'es',
    notifications: user?.preferences?.notifications !== false
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Aquí iría la lógica para guardar los cambios
    setTimeout(() => {
      setIsSaving(false);
      // Mostrar mensaje de éxito
    }, 1000);
  };

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>
          {getUserInitials(user?.name || 'U')}
        </Avatar>
        <UserInfo>
          <UserName>{user?.name}</UserName>
          <UserRole role={user?.role}>{user?.role}</UserRole>
          <UserEmail>{user?.email}</UserEmail>
        </UserInfo>
      </ProfileHeader>

      <ProfileGrid>
        <Section>
          <SectionTitle>
            <FiUser />
            Información Personal
          </SectionTitle>
          
          <FormGroup>
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormGroup>

          <SaveButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <LoadingSpinner size="16px" />
                Guardando...
              </>
            ) : (
              <>
                <FiSave />
                Guardar Cambios
              </>
            )}
          </SaveButton>
        </Section>

        <Section>
          <SectionTitle>
            <FiSettings />
            Cambiar Contraseña
          </SectionTitle>
          
          <FormGroup>
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <PasswordContainer>
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
              />
              <PasswordToggle onClick={() => togglePasswordVisibility('current')}>
                {showPasswords.current ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </PasswordContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <PasswordContainer>
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
              <PasswordToggle onClick={() => togglePasswordVisibility('new')}>
                {showPasswords.new ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </PasswordContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <PasswordContainer>
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <PasswordToggle onClick={() => togglePasswordVisibility('confirm')}>
                {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </PasswordContainer>
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>
            <FiSettings />
            Preferencias
          </SectionTitle>
          
          <SwitchContainer>
            <SwitchLabel>
              {preferences.theme === 'light' ? <FiSun /> : <FiMoon />}
              Tema oscuro
            </SwitchLabel>
            <Switch>
              <input
                type="checkbox"
                checked={preferences.theme === 'dark'}
                onChange={(e) => handlePreferenceChange('theme', e.target.checked ? 'dark' : 'light')}
              />
              <span className="slider"></span>
            </Switch>
          </SwitchContainer>

          <SwitchContainer>
            <SwitchLabel>
              <FiBell />
              Notificaciones
            </SwitchLabel>
            <Switch>
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
              />
              <span className="slider"></span>
            </Switch>
          </SwitchContainer>
        </Section>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default Profile;
