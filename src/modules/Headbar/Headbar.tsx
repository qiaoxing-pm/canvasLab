import MenuBar from "./components/MenuBar";
import WindControls from "./components/WindControls";
import { Wrapper } from "./styled";
import { Window } from "@tauri-apps/api/window";

const Headbar = () => {
  const appWindow = new Window("main");
  return (
    <Wrapper onMouseDown={(e) => {
      if (e.button === 0) {
        appWindow.startDragging();
      }
    }}>
      <MenuBar />
      <div className="windowHeadbar"></div>
      <WindControls />
    </Wrapper>
  );
};

export default Headbar;
