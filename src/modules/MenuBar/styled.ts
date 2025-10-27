import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: max-content;
  background-color: #5e5e5e;
  .wrapper-content {
    display: flex;
    justify-content: left;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    box-sizing: border-box;
    padding: 2px 2px;
    height: max-content;
    gap: 0;
  }
`;

export { Wrapper };
