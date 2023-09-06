import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import styled from "styled-components";

const SidebarWrapper = styled.div`
  background-color: #fabb79;
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const SidebarItem = styled.div`
  color: #fff;
  font-size: 22px;
  padding: 10px;
  cursor: pointer;
  justify-content: center;
  margin-bottom: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f9840c;
  }
`;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownIcon = styled(DownOutlined)`
  margin-left: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.4s, translate 0.4s;
  transform: ${({ open }) =>
    open ? "rotate(0deg) translateY(-7px)" : "rotate(90deg) translateX(-7px)"};
`;

const DropdownContent = styled.div`
  opacity: ${({ open }) => (open ? "1" : "0")};
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  display: flex;
  position: absolute;
  left: 0;
  background-color: #f9840c;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  flex-direction: column;
  transition: opacity 0.3s, visibility 0.3s;
`;

const CustomLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  width: 180px;

  img {
    width: 28px;
    height: 28px;
    margin-right: 20px;
  }
`;

const DropdownItem = styled(CustomLink)`
  color: #fff;
  padding: 12px 16px;
  cursor: pointer;
  width: 160px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #fba54d;
  }
`;

const Sidebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutsideDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener when component mounts
    document.addEventListener("click", handleClickOutsideDropdown);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutsideDropdown);
    };
  }, []);

  const refresh = () => {
    // navigate to hikingTrails page and refresh the page
    window.location.href = "/hikingTrails";
  };

  return (
    <SidebarWrapper>
      <CustomLink to="/hikingDiscussion">
        <SidebarItem>
          <div className="flex items-center text-white">
            <img src="/../img/discussionIcon.png" alt="Discussion" />
            Discussion
          </div>
        </SidebarItem>
      </CustomLink>

      <div className="flex items-center text-white">
        <CustomLink onClick={refresh}>
          <SidebarItem>
            <div className="flex items-center text-white">
              <img src="/../img/trailsIcon.png" alt="Trails" />
              Trails
            </div>
          </SidebarItem>
        </CustomLink>

        <DropdownIcon
          open={isDropdownOpen}
          onClick={(e) => {
            e.stopPropagation();
            handleDropdownToggle();
          }}
        />
      </div>

      <Dropdown ref={dropdownRef}>
        <DropdownContent open={isDropdownOpen}>
          <DropdownItem to="/hikingTrails/suggest-trail">
            Suggest a trail
          </DropdownItem>
          <DropdownItem to="/hikingTrails/saved">Saved</DropdownItem>
        </DropdownContent>
      </Dropdown>
    </SidebarWrapper>
  );
};

export default Sidebar;
