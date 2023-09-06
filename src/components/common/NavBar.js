import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Space, Image, Form, message, Dropdown, Modal } from 'antd';
import axios from 'axios';
import { DownOutlined } from '@ant-design/icons';
import {AiOutlineUser, AiOutlineLogout} from 'react-icons/ai'
import { RiArrowDropDownLine } from 'react-icons/ri'

const NavBar = () => {
  const title = "Hi-Bro"

  const navigate = useNavigate();

  const { userId, profileImageUrl, userName, handleLogout } = useAuth();
  const [userImageUrl, setUserImageUrl] = useState('');

  useEffect(() => {
    // Fetch user image URL and update state
    async function fetchUserImage() {
      try {

        const response = await axios.get(`/api/getUserInfo/${userId}`);
        setUserImageUrl(response.data.profileImage);
        console.log('URL', response.data.profileImage)
      } catch (error) {
        console.error(error);
      }
    }
    fetchUserImage();
  }, []);

  // Nav bar profile
  const [open, setOpen] = useState(false);
  const handleMenuClick = (e) => {
    if (e.key === '1') {
      navigate(`/profile/${userId}`);
    }

    if (e.key === '2') {
      handleLogout(); // Call the logout function from AuthContext
        navigate('/'); // Redirect to the login page
    }
  };

  const handleOpenChange = (flag) => {
    setOpen(flag);
  };

  const items = [
    {
      label: 'View Profile',
      key: '1',
      icon: <AiOutlineUser/>,
    },
    {
      label: 'Logout',
      key: '2',
      icon: <AiOutlineLogout/>,
    },
  ];


  return (
    <nav className="navbar">
      <h1>{title}</h1>
      <div className="links">
        <Link to="/hikingDiscussion">Hiking</Link>
        <Link to="/TravelPost">Travel Buddy</Link>
      </div>
      <div className="profile">
        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick,
          }}
          onOpenChange={handleOpenChange}
          open={open}
        >
          <a onClick={(e) => e.preventDefault()} className="profile-link">
            <Space>
              <Image
                src={profileImageUrl}
                alt="profile"
                className='profile-profilePic'
                width={40}
                height={40}
                preview={false}
                style={{
                }}
              />
              <p className="profile-name">{userName}</p>
              <RiArrowDropDownLine />
            </Space>
          </a>
        </Dropdown>
      </div>
    </nav>
  );
};

export default NavBar;
