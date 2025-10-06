import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiBarChart2, 
  FiUsers, 
  FiSettings, 
  FiMenu,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '280px' : '80px'};
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  transition: width ${props => props.theme.transitions.normal};
  z-index: 1000;
  overflow: hidden;

  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    width: 280px;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  white-space: nowrap;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: opacity ${props => props.theme.transitions.normal};

  svg {
    font-size: 1.5rem;
  }
`;

const ToggleButton = styled.button`
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

  @media (max-width: 768px) {
    display: none;
  }
`;

const Nav = styled.nav`
  padding: 1rem 0;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0.25rem 0;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.fast};
  position: relative;
  white-space: nowrap;

  svg {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  span {
    opacity: ${props => props.isOpen ? '1' : '0'};
    transition: opacity ${props => props.theme.transitions.normal};
  }

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.text};
  }

  &.active {
    background: ${props => props.theme.colors.primary}10;
    color: ${props => props.theme.colors.primary};
    font-weight: 500;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${props => props.theme.colors.primary};
    }
  }

  @media (max-width: 768px) {
    span {
      opacity: 1;
    }
  }
`;

const Sidebar = ({ isOpen, onToggle }) => {
  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/dashboard/reports', icon: FiTrendingUp, label: 'Reportes' },
    { path: '/dashboard/activity', icon: FiActivity, label: 'Actividad' },
    { path: '/admin', icon: FiUsers, label: 'Administración' },
    { path: '/profile', icon: FiSettings, label: 'Perfil' }
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <Logo isOpen={isOpen}>
          <FiBarChart2 />
          {isOpen && 'Analytics Pro'}
        </Logo>
        <ToggleButton onClick={onToggle}>
          <FiMenu />
        </ToggleButton>
      </SidebarHeader>
      
      <Nav>
        <NavList>
          {navItems.map((item) => (
            <NavItem key={item.path}>
              <NavLinkStyled to={item.path} isOpen={isOpen}>
                <item.icon />
                <span>{item.label}</span>
              </NavLinkStyled>
            </NavItem>
          ))}
        </NavList>
      </Nav>
    </SidebarContainer>
  );
};

export default Sidebar;
