import React, { useState } from 'react'
import spinner from '../../public/Spinner.svg'
import './Spinner.css'

const Spinner = () => {
    return <>
        <div className='rectangle'>
            <img className='spinner' src={spinner}/>
        </div>
    </>;
  }
  
  export default Spinner;