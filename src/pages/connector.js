import { useState } from "react";

const quotes = {
  hiking: "Hiking is not just a walk, it's a journey of the soul.",
  travel:
    "Life is short and the world is wide. Explore and find your adventure.",
};

const Connector = () => {
  const [hovered, setHovered] = useState("");
  const transitionDuration = "0.5s";

  const handleHover = (element) => {
    setHovered(element);
  };

  const handleHikingClick = () => {
    window.location.href = "/hikingDiscussion";
  };

  const handleTravelClick = () => {
    window.location.href = "/TravelPost";
  };

  return (
    <div className="flex flex-row w-screen h-screen">
      <div
        className={`w-full h-full flex flex-col items-center justify-center text-center text-white text-4xl cursor-pointer ${
          hovered === "hiking" ? "w-3/4 backdrop-blur-md" : "w-1/2"
        } transition-all`}
        style={{
          background: `url("../img/edited-41.jpg") center/cover`,
          filter: hovered === "hiking" ? "brightness(50%) blur(0.2rem)" : "none",
          transition: `width ${transitionDuration}, filter ${transitionDuration}`,
        }}
        onMouseEnter={() => handleHover("travel")}
        onMouseLeave={() => handleHover("")}
        onClick={handleHikingClick}
      >
        <div className="bg">
          <div className="text-5xl">
            <b>Hiking</b>
          </div>
          <div className="mt-2 text-lg italic">{quotes.hiking}</div>
        </div>
      </div>
      <div
        className={`w-full h-full flex flex-col items-center justify-center text-center text-white text-4xl cursor-pointer ${
          hovered === "travel" ? "w-3/4 backdrop-blur-md" : "w-1/2"
        } transition-all`}
        style={{
          background: `url("../img/edited-21.jpg") center/cover`,
          filter: hovered === "travel" ? "brightness(50%) blur(0.2rem)" : "none",
          transition: `width ${transitionDuration}, filter ${transitionDuration}`,
        }}
        onMouseEnter={() => handleHover("hiking")}
        onMouseLeave={() => handleHover("")}
        onClick={handleTravelClick}
      >
        <div className="text-5xl">
          <b>Travel Buddy</b>
        </div>
        <div className="mt-2 text-lg italic">{quotes.travel}</div>
      </div>
    </div>
  );
};

export default Connector;
