import React from 'react';
import { Skeleton } from '@mui/material';
import { ChatPreviewSkeletonContainer, messageSkeletonContainer, messageSkeletonContent, chatThreadSkeletonContainer } from '../styles/ChatSkeletonStyles';

export const ChatPreviewSkeleton = () => (
  <ChatPreviewSkeletonContainer>
    <Skeleton variant="circular" width={40} height={40} />
    <div style={{ flex: 1, marginLeft: '12px' }}>
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="50%" />
    </div>
  </ChatPreviewSkeletonContainer>
);

export const MessageSkeleton = ({ direction }) => (
  <div style={messageSkeletonContainer(direction)}>
    <div style={messageSkeletonContent(direction)}>
      <Skeleton variant="rectangular" width={200} height={60} />
      <Skeleton variant="text" width={100} />
    </div>
  </div>
);

export const ChatThreadSkeleton = () => (
  <div style={chatThreadSkeletonContainer}>
    {[...Array(5)].map((_, i) => (
      <MessageSkeleton 
        key={i} 
        direction={i % 2 === 0 ? 'outgoing' : 'incoming'} 
      />
    ))}
  </div>
);
