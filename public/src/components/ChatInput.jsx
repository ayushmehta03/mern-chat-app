import React, { useState } from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';

const ChatInput = ({handleSendMsg}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState('');

  const sendEmoji = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const sendEmojiClick = (emojiData, event) => {
    setMsg((prevMsg) => prevMsg + emojiData.emoji);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg)
      setMsg('');
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={sendEmoji} />
          {showEmojiPicker && (
            <div className="emoji-wrapper">
              <Picker onEmojiClick={sendEmojiClick} />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(e)=>sendChat(e)}>
        <input
          type="text"
          placeholder="Enter your message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit" className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #080420;
  padding: 0.2rem;
  padding-bottom: 0.3rem;

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;
      left: 12px;

      svg {
        font-size: 1.89rem;
        color: #ffff00c8;
        cursor: pointer;
      }

      .emoji-wrapper {
        position: absolute;
        top: -465px;
        z-index: 100;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-radius: 1rem;
        overflow: hidden;

        /* Apply styling to container */
        .EmojiPickerReact {
          background-color: #0a061d !important;
          border: 1px solid #9186f3 !important;
          box-shadow: 0 5px 15px #9a86f3;
          border-radius: 1rem;
        }

        .EmojiPickerReact .epr-search {
          background-color: transparent !important;
          border: 1px solid #9186f3 !important;
          color: white !important;
        }

        .EmojiPickerReact .epr-emoji-category-label {
          background-color: #080420 !important;
          color: #ffffffaa !important;
        }

        .EmojiPickerReact .epr-body::-webkit-scrollbar {
          background-color: transparent;
          width: 6px;
        }

        .EmojiPickerReact .epr-body::-webkit-scrollbar-thumb {
          background-color: #9186f3;
          border-radius: 10px;
        }

        .EmojiPickerReact .epr-emoji {
          transition: transform 0.15s ease-in-out;
        }

        .EmojiPickerReact .epr-emoji:hover {
          transform: scale(1.2);
        }
      }
    }
  }

  .input-container {
    width: 100%;
    display: flex;
    border-radius: 2rem;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;

    input {
      width: 90%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;

export default ChatInput;
