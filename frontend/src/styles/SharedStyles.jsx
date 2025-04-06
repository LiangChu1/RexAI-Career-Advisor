import { styled } from '@mui/system';
import { Button } from '@mui/material';

export const RootContainer = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#f0f0f5',
    minHeight: '100vh',
    width: '100%',
}))

export const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f5',
    minHeight: '100vh',
    width: '100%',
}));

export const Logo = styled('img')({
  width: '25vw',
  height: 'auto',
});

export const MainTitleText = styled('h1')(({ theme }) => ({
  color: '#000000',
  margin: theme.spacing(2),
  fontSize: '4vw',
}));

export const SubTitleText = styled('h2')(({ theme }) => ({
  color: '#000000',
  margin: theme.spacing(2),
  fontSize: '3vw',
}));

export const MainButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3f51b5',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
  margin: theme.spacing(2),
  borderRadius: '2px',
  fontSize: '1vw',
}));

export const SubButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d60202',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#bf0202',
  },
  margin: theme.spacing(2),
  borderRadius: '2px',
  fontSize: '1vw',
}));