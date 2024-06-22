import React from 'react'

export default function Button({ fun, title, className }) {
  return (
    <button onClick={fun} className='cstButton'>
      <span>{title}</span>
    </button>
  )
}
