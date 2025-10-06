import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { Button } from '../styles/GlobalStyle';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 900;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 1rem 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 2rem 0;
  max-width: 500px;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const HomeButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>Página no encontrada</ErrorTitle>
      <ErrorMessage>
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
        Puedes regresar al dashboard o intentar navegar desde el menú principal.
      </ErrorMessage>
      
      <ActionButtons>
        <HomeButton as={Link} to="/dashboard" variant="primary">
          <FiHome />
          Ir al Dashboard
        </HomeButton>
        
        <BackButton onClick={() => window.history.back()} variant="secondary">
          <FiArrowLeft />
          Volver Atrás
        </BackButton>
      </ActionButtons>
    </NotFoundContainer>
  );
};

export default NotFound;
