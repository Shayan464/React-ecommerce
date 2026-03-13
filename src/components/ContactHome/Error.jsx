import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <>
    <h1 className='text-center text-4xl'>This Page is not Valid</h1>
        <Link to="/">
        <button className='text-red-800 text-3xl font-bold'>Go to Home</button>
        </Link>
    </>
  )
}

export default Error