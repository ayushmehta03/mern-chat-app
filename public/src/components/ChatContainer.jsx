import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { sendMessageRoute, getAllMessagesRoute } from '../Utils/APIRoutes';

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef(null);

  // Fetch all messages when chat or user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat && currentUser) {
        try {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        }
      }
    };
    fetchMessages();
  }, [currentChat, currentUser]);

  // Send a new message
  const handleSendMsg = useCallback(
    async (msg) => {
      try {
        await axios.post(sendMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
          message: msg,
        });

        socket.current.emit('send-msg', {
          to: currentChat._id,
          from: currentUser._id,
          message: msg,
        });

        const newMsg = {
          fromSelf: true,
          message: msg,
        };
        setMessages((prev) => [...prev, newMsg]);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    },
    [currentChat, currentUser, socket]
  );

  // Listen for incoming messages
  useEffect(() => {
    if (socket.current) {
      const handleReceiveMessage = (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      };

      socket.current.on('msg-receive', handleReceiveMessage);

      return () => {
        socket.current.off('msg-receive', handleReceiveMessage);
      };
    }
  }, [socket]);

  // Append received messages
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  // Scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    currentChat && (
      <Container>
        <div className="chat-header">
          <div className="user-details">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
          <Logout />
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={message._id || uuidv4()}
              ref={index === messages.length - 1 ? scrollRef : null}
              className={`message ${message.fromSelf ? 'sended' : 'received'}`}
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          ))}
        </div>

        <ChatInput handleSendMsg={handleSendMsg} />
      </Container>
    )
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  padding-top: 1rem;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar img {
        height: 3rem;
      }

      .username h3 {
        color: white;
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 45%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff21;
      }
    }

    .received {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer;
