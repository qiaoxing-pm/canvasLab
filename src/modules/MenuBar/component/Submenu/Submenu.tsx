import { useEffect } from "react";
import { Wrapper } from "./styled"


const Submenu = (props: any) => {
    return (
        <Wrapper>
            {props.props.map((item: any) => {
                return (
                    <div className="wrapper-item wrapper-border">
                        <span className={`iconfont ${item.icon}`}></span>
                    </div>
                )
            })}
        </Wrapper>
    )
}

export default Submenu;