import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: max-content;
  background-color: rgb(94, 94, 94);
  display: flex;
  justify-content: left;
  align-items: center;
  flex-wrap: wrap;

  .operation {
    width: 16px;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: move;
  }

  .wrapper-item {
    height: 30px;
    width: 30px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    &:hover {
      background-color: #c5deff9b;
      color: rgb(81, 81, 81);
    }
  }

  .wrapper-border {
    border-top: 2px solid rgb(142, 142, 142);
    border-right: 2px solid rgb(72, 72, 72);
    border-bottom: 2px solid rgb(72, 72, 72);
    border-left: 2px solid rgb(142, 142, 142);
  }
`;

export { Wrapper };
