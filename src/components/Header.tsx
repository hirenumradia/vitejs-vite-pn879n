import styled from 'styled-components';
import Link from 'next/link';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const SaveButton = styled(Button)`
  background-color: #4caf50;
  color: white;
`;

const PublishButton = styled(Button)`
  background-color: #2196f3;
  color: white;
`;

const StateDisplay = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
`;

const HomeLink = styled.span`
  display: flex;
  align-items: center;
  color: #333;
  text-decoration: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: #2196f3;
  }
`;

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const LastSavedDisplay = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

interface HeaderProps {
  onSave: () => void;
  onPublish: () => void;
  isPublished: boolean;
  currentState: string;
  lastSaved: Date | null;
}

const Header: React.FC<HeaderProps> = ({ onSave, onPublish, isPublished, currentState, lastSaved }) => {
  const formatLastSaved = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <HeaderContainer>
      <Link href="/" passHref>
        <HomeLink>
          <HomeIcon />
        </HomeLink>
      </Link>
      <Title>Workflow Editor</Title>
      <StateDisplay>State: {currentState}</StateDisplay>
      <ButtonGroup>
        <SaveButton onClick={onSave}>Save</SaveButton>
        <PublishButton onClick={onPublish}>
          {isPublished ? 'Unpublish' : 'Publish'}
        </PublishButton>
      </ButtonGroup>
      {lastSaved && (
        <LastSavedDisplay>
          Last saved: {formatLastSaved(lastSaved)}
        </LastSavedDisplay>
      )}
    </HeaderContainer>
  );
};

export default Header;