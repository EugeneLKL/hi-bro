import PropTypes from 'prop-types';
import { StarOutlined, ClockCircleOutlined, FireOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useState } from "react";

const NewIcon = styled(StarOutlined)`
  font-size: 15px;
  margin-right: 10px;
`;

const OldIcon = styled(ClockCircleOutlined)`
  font-size: 15px;
  margin-right: 10px;
`;

const HotIcon = styled(FireOutlined)`
  font-size: 15px;
  margin-right: 10px;
`;

const HikingSortPost = ({ onSortChange }) => {
  const [selectedSort, setSelectedSort] = useState(null);

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    onSortChange(sortValue);
  };

  const sortBy = (sortType) => {
    handleSortChange(sortType);
  };

  return (
    <div className="hiking-sort-post">
      <div className="sort-button">
        <button
          className={`sort-post-box-button ${selectedSort === "new" ? "active" : ""}`}
          onClick={() => sortBy("new")}
        >
          <NewIcon />
          New
        </button>
      </div>
      <div className="sort-button">
        <button
          className={`sort-post-box-button ${selectedSort === "old" ? "active" : ""}`}
          onClick={() => sortBy("old")}
        >
          <OldIcon />
          Old
        </button>
      </div>
      <div className="sort-button">
        <button
          className={`sort-post-box-button ${selectedSort === "hot" ? "active" : ""}`}
          onClick={() => sortBy("hot")}
        >
          <HotIcon />
          Hot
        </button>
      </div>
    </div>
  );
};

HikingSortPost.propTypes = {
  onSortChange: PropTypes.func.isRequired,
};

export default HikingSortPost;
