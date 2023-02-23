import { ChakraProvider,Box } from '@chakra-ui/react' 
import Files from './Files'
import { useEffect, useState } from 'react'
import FileUpload from './FileUpload'
import FileList from './FileList'
import { useNavigate } from 'react-router-dom';
function Main() {
    const [fileId, setFileId] = useState<number>(0)
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
        <ChakraProvider>
            <div className="container my-3 mx-4" style={{fontSize:"150%"}}>
                <h1>Hi, <b>{username}!</b></h1>
            </div>
            <Box
                width="60%"
                m="100px auto"
            >
                <Box mb="10">
                    <FileUpload setFileId={setFileId} />
                </Box>
                <FileList fileId={fileId}/>
            </Box>
        </ChakraProvider>
    )
}

export default Main