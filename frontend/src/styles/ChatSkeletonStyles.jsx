import { styled } from '@mui/system';

export const ChatPreviewSkeletonContainer = styled('div')({
  padding: '12px 16px',
  margin: '8px 0',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const messageSkeletonContainer = (direction) => ({
  display: 'flex',
  justifyContent: direction === 'outgoing' ? 'flex-end' : 'flex-start',
  margin: '8px 0',
  width: '100%',
});

export const messageSkeletonContent = (direction) => ({
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: direction === 'outgoing' ? 'flex-end' : 'flex-start',
});

export const chatThreadSkeletonContainer = {
  padding: '16px',
};
