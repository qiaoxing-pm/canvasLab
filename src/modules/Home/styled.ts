import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Menu = styled.div`
  width: 48px;
  height: 100%;
  box-sizing: border-box;
  border-right: 2px solid #333333;
  display: flex;
  justify-content: top;
  align-items: center;
  flex-direction: column;
`;

const FuncModule = styled.div`
  width: 100%;
  max-width: 100%;
  height: calc(100% - 33px);
  display: flex;
  justify-content: left;
  flex-direction: row;
`;

const LabelItem = styled.div`
  width: 48px;
  height: 48px;
  padding: 3px;
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
`;

const Content = styled.div`
  width: calc(100% - 218px);
  height: 100%;
  /* flex: 1; */
  background-color: #1e1e1e;
`;
const DataDisplayModule = styled.div`
  width: 170px;
  min-width: 170px;
  height: 100%;
  background-color: #252526;
`;
export { Wrapper, Menu, LabelItem, Content, FuncModule, DataDisplayModule };
