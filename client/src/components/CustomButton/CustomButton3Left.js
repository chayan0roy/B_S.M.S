import React from 'react'
import './CustomButton3.css'

export default function CustomButton3Left({ fun, height, width }) {
    return (
        <button className="LeftArrow" onClick={fun} aria-label="Previous">
            <span style={{ width: width, height: height }}></span>
            <span style={{ width: width, height: height }}></span>
            <span style={{ width: width, height: height }}></span>
        </button>
    )
}
