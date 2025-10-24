import { Wrapper } from "./styled";
import Home from "./modules/Home/Home"
import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import './assets/icon/iconfont.css';

const App = () => {

  useEffect(() => {
    getCurrentWindow().setShadow(false);
  }, [])

  return (
    <Wrapper>
      <Home />
    </Wrapper>
  )
}

export default App;
