import { Wrapper } from "./styled";


const GraphicSelection = () => {
    // ondragstart
    return (
        <Wrapper>
            <div draggable='true'
                onDragStart={(e) => { console.log(e) }}
                onDragEnd={(e) => {
                    console.log(e)
                }}
            >asfdlk;</div>
        </Wrapper>
    )
}

export default GraphicSelection;