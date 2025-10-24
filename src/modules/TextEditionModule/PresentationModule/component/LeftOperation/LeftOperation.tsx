import { Wrapper } from "./styled";


const LeftOperation = () => {
    return (
        <Wrapper>
            <div className='persentation-line-label'>
                <div className='status'></div>
                <div className='sort'>1</div>
                <div className='operation'></div>
            </div>
            <div className='persentation-line-label'>
                <div className='status'></div>
                <div className='sort'>2</div>
                <div className='operation'></div>
            </div>
            <div className='persentation-line-label'>
                <div className='status'></div>
                <div className='sort'>3</div>
                <div className='operation'></div>
            </div>
        </Wrapper>
    )
}

export default LeftOperation;