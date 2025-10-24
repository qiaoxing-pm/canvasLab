import styled from "styled-components";

const Wrapper = styled.div`
  width: max-content;
  height: 100%;
  display: flex;
  flex-direction: column;

  .persentation-line-label {
    height: 20px;
    max-height: 20px;
    width: 100%;
    min-width: 68px;
    box-sizing: border-box;
    display: grid;
    gap: 4px;
    grid-template-columns: 16px 1fr 16px;
    .status {
    }
    .sort {
      text-align: right;
      display: flex;
      justify-content: right;
      color: #a5a5a5ff;
    }
    .operation {
    }
  }
`;

export { Wrapper };
