"use client";
import { useState } from "react";
import styled from "styled-components";

const Checkbox = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="hover:bg-gray-200 hover:opacity-80 opacity-90 transition-all duration-300 h-[70px] w-[70px] flex items-center justify-center rounded-full">
      <StyledWrapper>
        <label className="hamburger" htmlFor="menu-toggle">
          <input
            id="menu-toggle"
            type="checkbox"
            checked={isMenuOpen}
            onChange={() => setIsMenuOpen(!isMenuOpen)}
          />
          <div className={`bar bar--top ${isMenuOpen ? "active" : ""}`} />
          <div className={`bar bar--middle ${isMenuOpen ? "active" : ""}`} />
          <div className={`bar bar--bottom ${isMenuOpen ? "active" : ""}`} />
        </label>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .hamburger {
    position: relative;
    width: 35px;
    height: calc(4px * 5 + 7px * 2);
    cursor: pointer;
    display: block;
  }

  .hamburger input {
    display: none;
  }

  .bar {
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 2px;
    background: #111827;  
    transition: all 0.35s cubic-bezier(0.5, -0.35, 0.35, 1.5);
  }

  .bar--top {
    bottom: calc(50% + 11px + 2px);
  }

  .bar--middle {
    top: calc(50% - 2px);
  }

  .bar--bottom {
    top: calc(50% + 11px + 2px);
  }

  .active.bar--top {
    transform: rotate(-135deg);
    bottom: calc(50% - 2px);
  }

  .active.bar--middle {
    opacity: 0;
    transform: rotate(-135deg);
  }

  .active.bar--bottom {
    transform: rotate(-225deg);
    top: calc(50% - 2px);
  }
`;

export default Checkbox;
