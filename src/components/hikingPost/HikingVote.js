import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import { UpCircleOutlined, DownCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../AuthContext";

const VoteContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const VoteCount = styled.div`
  margin: 5px;
  min-width: 80px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const UpArrowButton = styled(UpCircleOutlined)`
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s;
  margin: 5px;
  color: white;

  &:hover {
    color: #ff6f00;
  }

  &:focus {
    outline: none;
  }

  svg {
    width: 24px;
    height: 24px;
    transition: filter 0.3s; 
  }

  &.active {
    color: #ff6f00;
  }

  &:hover svg {
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3)); 
  }
`;

const DownArrowButton = styled(DownCircleOutlined)`
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s;
  margin: 5px;
  color: white;

  &:hover {
    color: #ff6f00;
  }

  &:focus {
    outline: none;
  }

  svg {
    width: 24px;
    height: 24px;
    transition: filter 0.3s; 
  }

  &.active {
    color: #ff6f00;
  }

  &:hover svg {
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3)); 
  }
`;

const HikingVote = ({ postId, containerStyle }) => {
  const [voteCounter, setVoteCounter] = useState(null);
  const { userId } = useAuth(); 

  const StyledVoteContainer = styled(VoteContainer)`
    ${containerStyle}
  `;

  const voteUp = async () => {
    setVoteCounter((prevVoteCounter) => prevVoteCounter + 1);
  };

  const voteDown = () => {
    setVoteCounter((prevVoteCounter) => prevVoteCounter - 1);
  };

  const handleVote = useCallback(async () => {
    try {
      await axios.patch(`/api/votes/${postId}`, { voteCounter });
      // Update the vote count in the database
    } catch (error) {
      console.error(error);
      // Handle error, if needed
    }
  }, [postId, voteCounter]);

  const fetchVote = useCallback(async () => {
    try {
      const response = await axios.get(`/api/votes/${postId}`);
      setVoteCounter(response.data.voteCounter);
    } catch (error) {
      console.error(error);
      // Handle the error or display an error message
    }
  }, [postId]);

  useEffect(() => {
    fetchVote();
  }, [fetchVote]);

  useEffect(() => {
    if (voteCounter !== null) {
      handleVote();
    }
  }, [voteCounter, handleVote]);

  useEffect(() => {
    setVoteCounter(0);
  }, [postId]);

  return (
    <StyledVoteContainer>
      <UpArrowButton onClick={voteUp} />
      <VoteCount>{voteCounter}</VoteCount>
      <DownArrowButton onClick={voteDown} />
    </StyledVoteContainer>
  );
};

export default HikingVote;
