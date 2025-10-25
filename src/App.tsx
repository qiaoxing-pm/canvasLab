import { Wrapper } from "./styled";
import Main from "./main/main/Main"
import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

import './static/iconfont/iconfont.css'

const App = () => {

  useEffect(() => {
    getCurrentWindow().setShadow(false);
  }, [])

  return (
    <Wrapper>
      <Main />
    </Wrapper>
  )
}

export default App;
