import React from 'react';
import { MainTitleText, SubTitleText } from '../styles/SharedStyles';
import {
  SidebarContainer,
  SidebarHeader,
  LargeIconButton,
} from '../styles/InboxStyles';
import ChatPreview from './ChatPreview';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { ChatPreviewSkeleton } from './SkeletonComponents';

// Sidebar component to display chat history and manage selection
const ChatHistoryPanel = ({
  isFetchingChats,
  activeChats,
  endedChats,
  selectedChatId,
  updateChatStatus,
  deleteChatRoom,
  setSelectedChatId,
  resetMessages,
  resetCurrentChatThread,
}) => {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <MainTitleText>Chats</MainTitleText>
        <LargeIconButton
          onClick={resetCurrentChatThread}
          startIcon={<AddBoxIcon />}
        />
      </SidebarHeader>

      {isFetchingChats ? (
        <>
          {[...Array(3)].map((_, i) => (
            <ChatPreviewSkeleton key={`active-${i}`} />
          ))}
          {[...Array(3)].map((_, i) => (
            <ChatPreviewSkeleton key={`ended-${i}`} />
          ))}
        </>
      ) : activeChats.length === 0 && endedChats.length === 0 ? (
        <div style={{ padding: '1rem', color: '#666', textAlign: 'center' }}>
          No messages available currently.
        </div>
      ) : (
        <>
          {activeChats.length > 0 && (
            <>
              <SubTitleText>Active</SubTitleText>
              {activeChats.map((chat) => (
                <ChatPreview
                  key={chat.chatId}
                  chat={chat}
                  updateChatStatus={updateChatStatus}
                  deleteChatRoom={deleteChatRoom}
                  setSelectedChatId={setSelectedChatId}
                  selectedChatId={selectedChatId}
                  resetMessages={resetMessages}
                />
              ))}
            </>
          )}
          {endedChats.length > 0 && (
            <>
              <SubTitleText>Ended</SubTitleText>
              {endedChats.map((chat) => (
                <ChatPreview
                  key={chat.chatId}
                  chat={chat}
                  updateChatStatus={updateChatStatus}
                  deleteChatRoom={deleteChatRoom}
                  setSelectedChatId={setSelectedChatId}
                  selectedChatId={selectedChatId}
                  resetMessages={resetMessages}
                />
              ))}
            </>
          )}
        </>
      )}
    </SidebarContainer>
  );
};

export default ChatHistoryPanel;
