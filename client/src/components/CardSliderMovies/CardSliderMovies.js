import React, { useRef, useState } from "react";
import styled from "styled-components";
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@material-ui/icons";
import MovieCard from "../CardMovie/MovieCard";
export default React.memo(function CardSliderMovies({ list }) {
  const listRef = useRef();
  const [sliderPosition, setSliderPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const handleDirection = (direction) => {
    let distance = listRef.current.getBoundingClientRect().x - 70;
    if (direction === "left" && sliderPosition > 0) {
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
      setSliderPosition(sliderPosition - 1);
    }
    if (direction === "right" && sliderPosition < 4) {
      listRef.current.style.transform = `translateX(${-230 + distance}px)`;
      setSliderPosition(sliderPosition + 1);
    }
  };

  return (
    <Container
      className="flex column"
      showcontrols={showControls ? showControls : undefined}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <h1 style={{ color: "white" }}>{list.title}</h1>
      <div className="wrapper">
        <div
          className={`slider-action left ${
            !showControls ? "none" : ""
          } flex j-center a-center`}
        >
          <ArrowBackIosOutlined
            onClick={() => handleDirection("left")}
            style={{ color: "white" }}
          />
        </div>
        <div className="slider flex" ref={listRef}>
          {list?.content?.map((item, index) => {
            return <MovieCard item={item} index={index} key={index} />;
          })}
        </div>
        <div
          className={`slider-action right ${
            !showControls ? "none" : ""
          }flex j-center a-center`}
        >
          <ArrowForwardIosOutlined
            onClick={() => handleDirection("right")}
            style={{ color: "white" }}
          />
        </div>
      </div>
    </Container>
  );
});
const Container = styled.div`
  gap: 1rem;
  position: relative;
  padding: 2rem 0;
  h1 {
    margin-left: 50px;
  }
  .wrapper {
    .slider {
      width: max-content;
      gap: 1rem;
      transform: translateX(0px);
      transition: 0.3s ease-in-out;
      margin-left: 50px;
    }
    .slider-action {
      position: absolute;
      z-index: 99;
      height: 100%;
      top: 0;
      bottom: 0;
      width: 50px;
      transition: 0.3s ease-in-out;
      cursor: pointer;
      display: flex;
      align-items: center;
      svg {
        font-size: 3rem;
      }
    }
    .none {
      display: none;
    }
    .left {
      left: 0;
    }
    .right {
      right: 0;
    }
  }
`;
