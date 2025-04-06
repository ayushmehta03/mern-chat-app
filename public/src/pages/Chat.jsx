import React, { useState, useEffect,useRef } from 'react';
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from 'react-router';
import { allUsersRoute, host } from '../Utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import io from "socket.io-client"
const Chat = () => {
  const socket= useRef()
  const navigate = useNavigate();
  const [contact, setContact] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const[currentChat,setcurrentChat]=useState(undefined);
  const[isLoaded,setIsLoaded]=useState(false)
  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate('/login');
      } else {
        setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    };
    checkUser();
  }, [navigate]);
  useEffect(()=>{
    if(currentUser) {
      socket.current=io(host);
      socket.current.emit("add-user",currentUser._id)
    }
  },[currentUser])

  useEffect(() => {
    const getContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContact(response.data);
          } catch (err) {
            console.error("Failed to fetch contacts", err);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
    getContacts();
  }, [currentUser, navigate]);
  const handleChatChange=(chat)=>{
    setcurrentChat(chat);

  }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contact} 
        currentUser={currentUser} 
        changeChat={handleChatChange}
        />
        {
       isLoaded &&   currentChat===undefined? (
            <Welcome 
            currentUser={currentUser}

        />
          ) : (
            <ChatContainer 
            currentChat={currentChat} 
            currentUser={currentUser}
            socket={socket} />
          )
        }

      </div>
    
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
