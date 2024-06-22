import React from 'react'

export default function Input({className, placeholder, type, fun}) {
  return (
    <input className={className} placeholder={placeholder} type={type} required onChange={(e) => fun(e.target.value)} />
  )
}
