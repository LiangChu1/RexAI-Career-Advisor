import {styled} from "@mui/material"
import { Button } from "@mui/material";
import AppBar from '@mui/material/AppBar';

export const NavBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: '#f0f0f5',
    borderBottom: '2px solid #000',
}));

export const NavLogo = styled('img')({
    width: '20vw',
    height: 'auto',
    marginTop: '5px',
    marginBottom: '5px',
});

export const NavPageTitleText = styled('h1')(({theme}) =>({
    color: '#000000',
    margin: theme.spacing(2),
    fontSize: '3vw',
}));

export const NavButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#d3d3e8',
    color: '#000000',
    '&:hover': {
        backgroundColor: '#303f9f',
        color: '#ffffff',
    },
    margin: theme.spacing(2),
    borderRadius: '12px',
    boxShadow: '0px 4px 10px rgba(0,0,0,.1)',
    width: '12%',
}));