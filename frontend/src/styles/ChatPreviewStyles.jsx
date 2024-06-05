import {styled} from "@mui/material";

export const ChatPreviewContainer = styled('div')(({ theme }) => ({
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0px 4px 10px rgba(0,0,0,.1)',
    padding: theme.spacing(3),
    margin: theme.spacing(1),
    width: '70%',
}));

export const ChatName = styled('h3')(({ theme }) => ({
    color: '#000000',
    fontSize: '2.5vw',
}));

export const ChatMessage = styled('p')(({ theme }) => ({
    color: '#000000',
    fontSize: '2vw',
}));

export const ChatMessageButtonDivider = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
}));  

  