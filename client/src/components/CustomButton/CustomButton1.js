import React from 'react';
import './CustomButton1.css';

export default function CustomButton1({ title, fun, padding }) {
    return (
        <button className='customButton1' style={{ '--clr': '#39FF14', padding: padding }} onClick={fun}>
            <span>{title}</span>
            <i></i>
        </button>
    );
}
