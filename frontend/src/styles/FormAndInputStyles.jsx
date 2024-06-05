import {styled} from "@mui/material";

export const MainForm = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
}));

export const FormInput = styled('input')(({ theme }) => ({
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    width: '100%',
    fontSize: '1.5vw',
}));