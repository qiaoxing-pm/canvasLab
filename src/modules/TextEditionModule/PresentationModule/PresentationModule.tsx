import { LeftOperation, MonacoEditor } from './component';
import { Wrapper } from './styled'
// import { MonacoEditor } from './monaco';
import { useEffect, useRef } from 'react';

const PresentationModule = () => {

    const persentation = useRef(null);
    // let monaco = {};

    // useEffect(() => {

    //     if (persentation) {
    //         monaco = new MonacoEditor(persentation);
    //     }
    // })


    return (
        <Wrapper>
            {/* < LeftOperation /> */}
            {/* <div className='persentation-line'>

            </div> */}
            <div className='wrapper-presentation'>
                <div ref={persentation} className='presentation-content'>
                    <MonacoEditor />
                </div>
            </div>
        </Wrapper>
    )
}


export default PresentationModule;