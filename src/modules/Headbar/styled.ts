import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 33px;
  background-color: #323233;
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  .windowControls {
    width: max-content;
    height: 33px;
    display: flex;

    button {
      width: 44px;
      font-size: 14px;
      color: #b5b5b5;
      cursor: pointer;

      &:hover {
        background-color: #505050;
      }
    }
  }
`;

export { Wrapper };
