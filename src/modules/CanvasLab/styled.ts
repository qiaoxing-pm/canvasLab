import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  font-size: 14px;

  .wrapper-canvas {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: auto;

    .wrapper-canvas-wapper {
      width: max-content;
      height: max-content;
      overflow: hidden;
      .wrapper-asdf {
        width: 10px;
        height: 10000px;
      }

      /* 基础流动动画 - 模拟液体流动 */
      .flow {
        stroke: #000000ff;
        stroke-width: 1;
        stroke-linecap: round;
        stroke-dasharray: 5 10;
        animation: flowAnimation 0.3s linear infinite,
          pulseAnimation 1s ease-in-out infinite;
        opacity: 0.8;
      }

      @keyframes flowAnimation {
        0% {
          stroke-dashoffset: 15;
          stroke-width: 5;
        }
        100% {
          stroke-dashoffset: 0;
          stroke-width: 1;
        }
      }
      @keyframes pulseAnimation {
        0%,
        100% {
          stroke-width: 2;
          opacity: 0.8;
        }
        50% {
          stroke-width: 4;
          opacity: 1;
        }
      }
    }
  }
`;

export { Wrapper };
