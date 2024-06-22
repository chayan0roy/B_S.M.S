import React from 'react'
import './CustomButton2.css'

export default function CustomButton2({ title, fun, padding }) {
    return (
        <button className='customButton2' style={{ '--color': '#39FF14', padding: padding }} onClick={fun}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {title}
        </button>
    )
}
