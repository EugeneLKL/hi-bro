import {
  AiOutlineStar,
  AiOutlineFire,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { useState } from "react";

const HikingSortPost = ({ onSortChange }) => {
  const [selectedSort, setSelectedSort] = useState(null);

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    onSortChange(sortValue);
  };

  const sortByNewest = () => {
    handleSortChange("new");
  };

  const sortByOldest = () => {
    handleSortChange("old");
  };

  const sortByHot = () => {
    handleSortChange("hot");
  };

  return (
    <div className="hiking-sort-post">
      <div className="sort-button">
        <button
          className={`sort-post-box-button ${
            selectedSort === "new" ? "active" : ""
          }`}
          onClick={sortByNewest}
        >
          <AiOutlineStar className="sort-icon" />
          New
        </button>
      </div>
      <div className="sort-button">
        <button
          className={`sort-post-box-button ${
            selectedSort === "old" ? "active" : ""
          }`}
          onClick={sortByOldest}
        >
          <AiOutlineClockCircle className="sort-icon" />
          Old
        </button>
      </div>
      <div className="sort-button">
        <button
          className={`sort-post-box-button ${
            selectedSort === "hot" ? "active" : ""
          }`}
          onClick={sortByHot}
        >
          <AiOutlineFire className="sort-icon" />
          Hot
        </button>
      </div>
    </div>
  );
};

export default HikingSortPost;
