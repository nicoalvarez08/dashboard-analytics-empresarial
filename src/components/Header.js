import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  FiMenu, 
  FiBell, 
  FiSearch, 
  FiUser, 
  FiLogOut,
  FiSettings,
  FiMoon,
  FiSun
} from 'react-icons/fi';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.border};
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
  font-size: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: transparent;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.text};
  }

  ${props => props.hasNotification && `
    &::after {
      content: '';
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 0.5rem;
      height: 0.5rem;
      background: ${props.theme.colors.error};
      border-radius: 50%;
    }
  `}
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 200px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  z-index: 1000;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.isOpen ? '0' : '-10px'});
  transition: all ${props => props.theme.transitions.fast};
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text};
  text-align: left;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }

  &:first-child {
    border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg};
  }

  svg {
    font-size: 1rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
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
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onMenuClick}>
          <FiMenu />
        </MenuButton>
        
        <SearchContainer>
          <SearchIcon />
          <SearchInput 
            type="text" 
            placeholder="Buscar métricas, reportes..." 
          />
        </SearchContainer>
      </LeftSection>

      <RightSection>
        <IconButton onClick={toggleTheme} title="Cambiar tema">
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </IconButton>
        
        <IconButton hasNotification title="Notificaciones">
          <FiBell />
        </IconButton>

        <UserMenu>
          <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <UserAvatar>
              {getUserInitials(user?.name || 'U')}
            </UserAvatar>
            <UserInfo>
              <UserName>{user?.name}</UserName>
              <UserRole>{user?.role}</UserRole>
            </UserInfo>
          </UserButton>

          <DropdownMenu isOpen={userMenuOpen}>
            <DropdownItem onClick={() => setUserMenuOpen(false)}>
              <FiUser />
              Ver Perfil
            </DropdownItem>
            <DropdownItem onClick={() => setUserMenuOpen(false)}>
              <FiSettings />
              Configuración
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>
              <FiLogOut />
              Cerrar Sesión
            </DropdownItem>
          </DropdownMenu>
        </UserMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
