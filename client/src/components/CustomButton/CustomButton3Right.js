import React from 'react'
import './CustomButton3.css'

export default function CustomButton3Right({ fun, height, width }) {
    return (
        <button className="RightArrow" onClick={fun} aria-label="Next">
            <span style={{ width: width, height: height }}></span>
            <span style={{ width: width, height: height }}></span>
            <span style={{ width: width, height: height }}></span>
        </button>
    )
}
