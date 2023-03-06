import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
const SelectionScreen = () => {
    const [fileId, setFileId] = useState(0)
    const [username, setusername] = useState('')
    let navigate = useNavigate();
    useEffect(()=>{
        if(!localStorage.getItem('token'))
        {
            navigate('/login')
        }
        else
        {
            fetch('http://localhost:5000/api/auth/getuser', {
            method: 'POST',
            headers:{
                'auth-token': localStorage.getItem('token') || ''
            }
            }).then(response => {
                //console.log(response)
                return response.json()}).then(data => {
                console.log(data)
                //setFileList(data)
                setusername(data.user_name)
            })
        }
    },[])
  return (
    <div className='container mt-5'>
        <h1 className='text-center'>Choose your <b>Role</b></h1>
        <div className='d-flex mt-5 pt-5' style={{marginLeft:"375px"}}>
            <div className='  mx-5 fa-5x px-5 '>
                <Link to="/dev"><i className="fab fa-brands fa-dev"></i></Link>        
                

            </div>
            
            <div className=' mx-5 fa-5x px-5'>
                <Link to="/rev" style={{textDecoration:"none"}}><i className="fa fa-solid fa-user "></i></Link>        
                
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