import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: left;
  font-size: 14px;

  .wrapper-presentation {
    width: 100%;
    height: 100%;

    overflow: auto;
  }

  .presentation-content {
    width: max-content;
    box-sizing: border-box;
    height: max-content;
    min-height: 200%;
    min-width: 100%;
    border: none;
    color: white;
    outline: none;
    overflow: hidden;
    background-color: transparent;
  }
`;

export { Wrapper };
