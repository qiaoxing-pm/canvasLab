import {LeftOperation} from './component';
import { Wrapper } from './styled'

const PresentationModule = () => {

    return (
        <Wrapper>
            < LeftOperation />
            {/* <div className='persentation-line'>

            </div> */}
            <div className='wrapper-presentation'>
                <div className='presentation-content' contenteditable="true">
                </div>
            </div>
        </Wrapper>
    )
}


export default PresentationModule;