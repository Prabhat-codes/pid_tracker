import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [credentials, setCredentials] = useState({name:"", email: "", password: ""}) 
    //let history = useHistory();
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username:credentials.name,email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
        console.log(json);
        if(json.success)
        {
             // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken); 
            navigate('/')
        }
        else{
            alert(json.message)
        }
           
            
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
  return (
    <div className="container d-flex align-items-center justify-content-center my-4">
    <div className='card col-md-4'>
        <div className="card-header text-center">
            <h3 className="card-title">SignUp</h3>
        </div>
            <form className='container my-3'  onSubmit={handleSubmit}>
            <div className="mb-3">
                    <label htmlFor="name" className="form-label">UserName</label>
                    <input type="text" className="form-control" value={credentials.name} onChange={onChange} id="name" name="name" aria-describedby="nameHelp" required  />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" required  />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" required minLength={5} />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default SignUp