import React, {useEffect, useRef} from "react"
import {clickPoint, draw, drawPoints} from "./draw"

function Canvas(props) {
    const canvas = useRef()

    useEffect(() => {
        if(props.results != null) {
            draw(props.r, canvas.current.getContext("2d"))
            drawPoints(props.r, props.results, canvas.current.getContext("2d"))
        }
    }, [draw, drawPoints, props])
    return <div>

        <canvas className="p-align-center" width="750" height="500" ref={canvas} onClick={(e) => {
            clickPoint(e, canvas.current.getContext("2d"),props.r, props.validateNumber, props.messageText, props.setResults)
        }}/>
    </div>
}

export default Canvas;