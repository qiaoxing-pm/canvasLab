
// import { Wrapper } from "./styled";
import { Window } from "@tauri-apps/api/window";




const WindControls = () => {

    const appWindow = new Window("main");

    return (
        <div className="windowControls" onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}>
            <button
                onClick={() => {
                    appWindow.minimize();
                }}
                className="minimize iconfont icon-suoxiao"
            ></button>
            <button
                onClick={() => {
                    appWindow.isMaximized().then((e) => {
                        if (!e) {
                            appWindow.maximize();
                        } else {
                            appWindow.unmaximize();
                        }
                    });
                }}
                className="maximize iconfont icon-quanping"
            ></button>
            <button
                onClick={() => {
                    appWindow.close();
                }}
                className="close  iconfont icon-tuichu"
            ></button>
        </div>
    )
}


export default WindControls;