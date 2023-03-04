import React from 'react'
import { Link } from 'react-router-dom'

const SelectionScreen = () => {
  return (
    <div className='container mt-5'>
        <h1 className='text-center'>Choose your <b>Role</b></h1>
        <div className='d-flex mt-5 pt-5' style={{marginLeft:"375px"}}>
            <div className='  mx-5 fa-5x px-5 '>
                <Link to="/main"><i className="fab fa-brands fa-dev"></i></Link>        
                

            </div>
            
            <div className=' mx-5 fa-5x px-5'>
                <Link to="/main" style={{textDecoration:"none"}}><i className="fa fa-solid fa-user "></i></Link>        
                
            </div>
        </div>
        <div className='d-flex' style={{marginLeft:"350px"}}>
            <div className='  mx-5  px-5 '>        
                <h3>Developer</h3>
            </div>
            
            <div className=' mx-5  '>        
            <h3>Reviewer</h3>
            </div>
        </div>
    </div>
  )
}

export default SelectionScreen