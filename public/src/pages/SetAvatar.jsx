import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../assests/loader.gif";
import axios from "axios";
import { setAvatarRoute } from "../Utils/APIRoutes";

const SetAvatar = () => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate('/login');
      }
    });
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }
  
    const userData = localStorage.getItem("chat-app-user");
    if (!userData) {
      toast.error("User not logged in!", toastOptions);
      return;
    }
  
    const user = JSON.parse(userData);
  
    try {
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
  
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Failed to set avatar. Please try again.", toastOptions);
      }
    } catch (err) {
      toast.error("Something went wrong while setting avatar", toastOptions);
      console.error(err);
    }
  };
  

  const fetchAvatars = async () => {
    try {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const randomId = Math.floor(Math.random() * 1000);
        const response = await axios.get(`http://localhost:5000/api/avatar/${randomId}`, {
          responseType: "arraybuffer",
        });
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        data.push(base64);
      }
      setAvatars(data);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error loading avatars:", error);
      toast.error("Failed to load avatars. Please try again.", toastOptions);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container className="container loader">
          <img src={Loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container className="container">
          <div className="title-container">
            <h1>Pick an avatar as your profile pic</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt={`avatar-${index}`} />
              </div>
            ))}
          </div>
          <button className="sumbit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 80%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
      }
    }

    .selected {
      border: 0.36rem solid #4e0eff;
    }
  }

  .sumbit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;

    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetAvatar;
