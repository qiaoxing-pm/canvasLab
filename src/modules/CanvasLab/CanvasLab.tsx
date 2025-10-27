import { useEffect, useRef, useState } from 'react';
import { Wrapper } from './styled'
import { type CellStyle, EventObject, Graph, InternalEvent, Point } from '@maxgraph/core';
import { createGraph, cellAnimation, Drop, useCanvas, release } from './util/util'


const CanvasLab = () => {

    const containerCur = useRef(null);
    let graphState: Graph | null = null;
    const rpsVar = {
        value: {}
    }
    useEffect(() => {

        const container = containerCur.current;
        // graphState = Drop(container);

        // const graph = new Graph(container);
        // graphState = graph

        useCanvas(container, rpsVar, release, graphState);

        // graphState.addListener(InternalEvent.CLICK, (e, q) => {
        //     console.log(q)
        // })


        // graphState.addListener(InternalEvent.CHANGE, (_, e) => {
        //     console.log(_, e)
        // })

        // graphState.addListener(InternalEvent.CELLS_MOVED, (_: any, e: EventObject) => {
        //     // console.log(_, e)
        //     requestAnimationFrame(() => {
        //         const cell = e.getProperty("cells");
        //         for (let i = 0; i < cell.length; i++) {
        //             const element = cell[i];
        //             for (let j = 0; j < element.edges.length; j++) {
        //                 const elementEdges = element.edges[j];
        //                 const state = graphState.view.getState(elementEdges)
        //                 cellAnimation(state)
        //             }
        //         }
        //     })
        // })
        // return () => {
        //     graphState?.destroy();
        // }

    }, [])


    return (
        <Wrapper
            onClick={() => {
                if (graphState) {
                }
            }}
            onDragEnd={(e) => {
                console.log(e)
            }}
        >
            <div className='wrapper-canvas'>
                <div className='wrapper-canvas-wapper'>
                    <canvas ref={containerCur} className='wrapper-canvas-content'></canvas>
                    {/* <div id="graph-container" ref={containerCur}></div> */}
                </div>
            </div>
        </Wrapper>
    )
}


export default CanvasLab;