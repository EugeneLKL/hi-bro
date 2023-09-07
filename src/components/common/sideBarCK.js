import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { BsFillSignpostSplitFill } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'

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



const Sidebar = () => {

  return (
    <SidebarWrapper>
      <CustomLink to="/TravelPost">
        <SidebarItem>
          <div className="flex items-center text-white">
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
                gap: "1rem",
              }}
            > <BsFillSignpostSplitFill /> Post</span>
          </div>
        </SidebarItem>
      </CustomLink>

      <div className="flex items-center text-white">
        <CustomLink to="/TravelRequestment">
          <SidebarItem>
            <div className="flex items-center text-white">
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  gap: "1rem",
                }}
              > <FiUsers /> Requestment</span>
            </div>
          </SidebarItem>
        </CustomLink>


      </div>


    </SidebarWrapper>
  );
};

export default Sidebar;
