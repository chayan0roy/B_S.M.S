import React from 'react'
import './CustomInput.css'

export default function CustomInput({ type, placeholder, fun }) {
    return (
        <div className="form-group">
            <input type={type} id='input' placeholder="" onChange={(e) => fun(e.target.value)} required />
            <label for="input">{placeholder}</label>
        </div>
    )
}
