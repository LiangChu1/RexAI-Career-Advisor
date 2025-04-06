import { styled } from '@mui/material';

export const ChatPreviewContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'selected',
})(({ theme, selected }) => ({
  backgroundColor: selected ? '#e3f2fd' : '#ffffff',
  border: selected ? '2px solid #1976d2' : '2px solid transparent',
  borderRadius: '20px',
  boxShadow: selected
    ? '0px 4px 20px rgba(25, 118, 210, 0.3)'
    : '0px 4px 10px rgba(0,0,0,.1)',
  padding: theme.spacing(2),
  width: '90%',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  marginBottom: theme.spacing(2),
}));

export const ChatName = styled('h3')(({ theme }) => ({
  color: '#000000',
  fontSize: '1.5vw',
}));

export const ChatMessage = styled('p')(({ theme }) => ({
  color: '#000000',
  fontSize: '1vw',
}));

export const ChatMessageButtonDivider = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));
