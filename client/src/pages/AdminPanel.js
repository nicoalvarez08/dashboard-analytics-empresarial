import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  FiUsers, 
  FiBarChart2, 
  FiSettings, 
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiShield,
  FiDatabase,
  FiServer,
  FiActivity,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import { Card, Button, Input, LoadingSpinner } from '../styles/GlobalStyle';
import axios from 'axios';

const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.5rem 0 0 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};

  svg {
    font-size: 1.5rem;
  }
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const UsersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const UsersTable = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.surfaceHover};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  align-items: center;
  transition: background-color ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const UserName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RoleBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  ${props => {
    switch (props.variant) {
      case 'edit':
        return `
          background: ${props.theme.colors.warning}15;
          color: ${props.theme.colors.warning};
          &:hover {
            background: ${props.theme.colors.warning}25;
          }
        `;
      case 'delete':
        return `
          background: ${props.theme.colors.error}15;
          color: ${props.theme.colors.error};
          &:hover {
            background: ${props.theme.colors.error}25;
          }
        `;
      default:
        return `
          background: ${props.theme.colors.surfaceHover};
          color: ${props.theme.colors.textSecondary};
          &:hover {
            background: ${props.theme.colors.border};
          }
        `;
    }
  }}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
      fetchStats();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size="40px" />
      </LoadingContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <div>
          <Title>Panel de Administración</Title>
          <Subtitle>Gestiona usuarios, métricas y configuraciones del sistema</Subtitle>
        </div>
      </AdminHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FiUsers />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.totalUsers || 0}</StatValue>
            <StatLabel>Total Usuarios</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FiBarChart2 />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.activeUsers || 0}</StatValue>
            <StatLabel>Usuarios Activos</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FiSettings />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.recentUsers || 0}</StatValue>
            <StatLabel>Nuevos (30 días)</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <UsersSection>
        <SectionHeader>
          <SectionTitle>Gestión de Usuarios</SectionTitle>
          <SearchContainer>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }} />
              <Input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '300px' }}
              />
            </div>
            <Button variant="primary">
              <FiPlus />
              Nuevo Usuario
            </Button>
          </SearchContainer>
        </SectionHeader>

        <UsersTable>
          <TableHeader>
            <div>Usuario</div>
            <div>Email</div>
            <div>Rol</div>
            <div>Estado</div>
            <div>Acciones</div>
          </TableHeader>
          
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserInfo>
              <div>{user.email}</div>
              <RoleBadge role={user.role}>{user.role}</RoleBadge>
              <div>{user.isActive ? 'Activo' : 'Inactivo'}</div>
              <ActionButtons>
                <ActionButton variant="edit" title="Editar usuario">
                  <FiEdit />
                </ActionButton>
                <ActionButton variant="delete" title="Eliminar usuario">
                  <FiTrash2 />
                </ActionButton>
              </ActionButtons>
            </TableRow>
          ))}
        </UsersTable>
      </UsersSection>
    </AdminContainer>
  );
};

export default AdminPanel;
