import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const HikingVote = ({ postId }) => {
  const [voteCounter, setVoteCounter] = useState(null);

  const voteUp = () => {
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
    <div className="hiking-post-vote">
      <button className="voteUp">
        <img
          src="/img/voteArrowIcon.png"
          alt="Up arrow"
          id="up"
          onClick={voteUp}
        />
      </button>
      <div className="vote-count">{voteCounter === null ? 0 : voteCounter}</div>
      <button className="voteDown">
        <img
          src="/img/voteArrowIcon.png"
          alt="Down arrow"
          id="down"
          onClick={voteDown}
        />
      </button>
    </div>
  );
};

export default HikingVote;
