import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import React, { useState, useEffect, useRef } from "react";
import { Button, Space, Image, Form, message, Dropdown, Modal } from "antd";
import axios from "axios";
import { DownOutlined } from "@ant-design/icons";
import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useQuery } from "react-query";

const NavBar = () => {
  const title = "Hi-Bro";

  const navigate = useNavigate();

  const { userId, handleLogout } = useAuth();
  const [userImageUrl, setUserImageUrl] = useState("");
  const [username, setUsername] = useState("");

  const { data: userData, isLoading } = useQuery(
    ["user", userId],
    async () => {
      const response = await axios.get(`/api/getUserInfo/${userId}`);
      console.log(response);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setUserImageUrl(data.profileImage);
        setUsername(data.userName);
      },
    }
  );


  // Nav bar profile
  const [open, setOpen] = useState(false);
  const handleMenuClick = (e) => {
    if (e.key === "1") {
      navigate(`/profile/${userId}`);
    }

    if (e.key === "2") {
      //CLear local storage before logout
      localStorage.clear();

      handleLogout(); // Call the logout function from AuthContext
      navigate("/"); // Redirect to the login page
    }
  };

  const handleOpenChange = (flag) => {
    setOpen(flag);
  };

  const items = [
    {
      label: "View Profile",
      key: "1",
      icon: <AiOutlineUser />,
    },
    {
      label: "Logout",
      key: "2",
      icon: <AiOutlineLogout />,
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
                src={userImageUrl}
                alt="profile"
                className="profile-profilePic"
                width={40}
                height={40}
                preview={false}
                style={{}}
              />
              <p className="profile-name">{username}</p>
              <RiArrowDropDownLine />
            </Space>
          </a>
        </Dropdown>
      </div>
    </nav>
  );
};

export default NavBar;
