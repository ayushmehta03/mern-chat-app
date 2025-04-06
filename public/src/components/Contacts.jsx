import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import logo from '../assests/logo.svg';

const Contacts = ({ contacts, currentUser, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [search, setSearch] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  useEffect(() => {
    setFilteredContacts(
      contacts
        .filter(contact =>
          contact.username.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.username.localeCompare(b.username))
    );
  }, [contacts, search]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <img src={logo} alt="logo" />
            <h3>Chatlify</h3>
          </div>

          <div className="search">
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="contacts">
            {filteredContacts.map((contact, index) => (
              <div
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                key={contact._id || index}
                role="button"
                tabIndex={0}
                onClick={() => changeCurrentChat(index, contact)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') changeCurrentChat(index, contact);
                }}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt={`avatar-${index}`}
                  />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>

                {/* Optional status dot */}
                {contact.isOnline !== undefined && (
                  <div className={`status-dot ${contact.isOnline ? 'online' : 'offline'}`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="current-user-avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 10% 65% 15%;
  overflow: hidden;
  background-color: #080420;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .search {
    display: flex;
    justify-content: center;
    padding: 0 1rem;
    input {
      width: 90%;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: none;
      outline: none;
      font-size: 1rem;
      background-color: #1a1a2e;
      color: white;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    padding: 0 1rem;

    &::-webkit-scrollbar {
      width: 0.2rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ffffff39;
      border-radius: 1rem;
    }

    .contact {
      background-color: #ffffff39;
      min-height: 5rem;
      width: 100%;
      cursor: pointer;
      border-radius: 0.2rem;
      padding: 0.4rem 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: 0.3s ease-in-out;
      outline: none;

      .avatar img {
        height: 3rem;
      }

      .username h3 {
        color: white;
      }

      .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-left: auto;

        &.online {
          background-color: #4caf50;
        }

        &.offline {
          background-color: #f44336;
        }
      }
    }

    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    .avatar img {
      height: 4rem;
      max-inline-size: 100%;
    }

    .username h2 {
      color: white;
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username h2 {
        font-size: 1rem;
      }
    }
  }
`;

export default Contacts;
