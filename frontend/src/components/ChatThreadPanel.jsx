import React from 'react';
import {
  ChatContainer,
  MessageListContainer,
} from '../styles/InboxStyles';
import {
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import { ChatThreadSkeleton } from './SkeletonComponents';

// Main message display/input panel for the selected chat
const ChatThreadPanel = ({
  user,
  messages,
  isTyping,
  isFetchingMessages,
  selectedChatId,
  creatingChat,
  handleSend,
  handleCreateNewChatThread,
}) => {
  const renderMessages = () => (
    <MessageList
      scrollBehavior="smooth"
      typingIndicator={
        isTyping ? <TypingIndicator content="Rex is typing" /> : null
      }
    >
      {messages.map((msg, i) =>
        msg.isTypingIndicator ? null : (
          <Message
            key={i}
            model={{
              message: msg.text,
              sender: msg.senderId === user.uid ? 'user' : 'Rex',
              direction:
                msg.senderId === user.uid ? 'outgoing' : 'incoming',
              sentTime: new Date(msg.timestamp._seconds * 1000).toLocaleString(),
            }}
          />
        )
      )}
    </MessageList>
  );

  return (
    <ChatContainer>
      <MessageListContainer>
        {selectedChatId ? (
          isFetchingMessages ? (
            <ChatThreadSkeleton />
          ) : (
            renderMessages()
          )
        ) : creatingChat ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ChatThreadSkeleton />
          </div>
        ) : (
          <div
            style={{
              color: '#888',
              fontSize: '1.1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              height: '100%',
              padding: '0 20px',
            }}
          >
            Select an existing chat or type in a message to start a new chat.
          </div>
        )}
      </MessageListContainer>

      <MessageInput
        placeholder="Type message here"
        onSend={selectedChatId ? handleSend : handleCreateNewChatThread}
        attachButton={false}
        style={{ marginBottom: '10px' }}
      />
    </ChatContainer>
  );
};

export default ChatThreadPanel;
