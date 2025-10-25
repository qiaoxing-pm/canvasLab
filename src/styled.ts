import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #323233;

  button {
    background-color: transparent;
    border: none;
  }

  * {
    overflow: hidden;

    &::-webkit-scrollbar {
      width: 12px;
      height: 8px;
      background: transparent;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      border: none;
    }

    &::-webkit-scrollbar-thumb {
      background: #ffffff28;
      border: none;
      border-radius: none;
    }
  }
`;

export { Wrapper };
