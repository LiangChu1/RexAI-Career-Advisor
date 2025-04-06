import { styled } from '@mui/system';
import { Button } from '@mui/material';

export const ChatContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100%',
  paddingBottom: '15px',
  position: 'relative',
});

export const MessageListContainer = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: '10px',
});

export const PageLayoutContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
});

export const SidebarContainer = styled('div')({
  width: '30%',
  minWidth: '300px',
  maxWidth: '400px',
  overflowY: 'auto',
  backgroundColor: '#f8f8f8',
  borderRight: '1px solid #ccc',
  padding: '20px',
});

export const SidebarHeader = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
});

export const LargeIconButton = styled(Button)(({ theme }) => ({
  '& .MuiButton-startIcon': {
    margin: 0,
    '& > *:first-of-type': {
      fontSize: '3rem',
    }
  }
}));