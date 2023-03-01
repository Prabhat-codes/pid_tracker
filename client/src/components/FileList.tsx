import { useState, useEffect , useContext } from 'react'
import FileContext from '../context/files/FileContext'
import {
    Flex,
    Text,
    UnorderedList,
    ListItem,
    Link,
    createStandaloneToast
} from '@chakra-ui/react'

import { getFileData } from '../service/FileDownloadService'

interface Props {
    fileId: number
}

function FileList(props: Props) {
    const {
        fileId
    } = props
    //const context = useContext(FileContext);
    //const {Files, getFiles} = context;
    const host = "http://localhost:5000"
    const [fileList, setFileList] = useState<Array<{ fileId: number, fileName: string , comment:string }>>([])
    // const getFiles = async ()=>{
    //     const response = await fetch("http://localhost:5000/api/files/fetchfiles", {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //           'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3fSwiaWF0IjoxNjc2OTkxNDE3fQ.Bqw-nJePtvpablO8VcDo3qG2vOcT7cNiOysdjWA1fSs'
    //         }
    //       }).then(response => response.json()).then(data => setFileList(data.files));
    //       console.log(fileList[0].fileName)
    //     //   const json = await response.json().then((data) => setFileList(data.files))
    //     //   console.log(json)
          
    // }
    // {
    //     fetch('http://localhost:5000/api/files/fetchfiles', {
    //         method: 'GET',
    //         headers:{
    //             'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2fSwiaWF0IjoxNjc2OTg3NDk2fQ.1QQj6pZGyHPDoBQv9fkRKtLfnXEWJZ1EDFum04BVlzA'
    //         }
    //     }).then(response => response.json()).then(data => setFileList(data.files))
    // }
    useEffect(() =>{
        fetch('http://localhost:5000/api/reviewer/pendingreview', {
            method: 'GET',
            headers:{
                'auth-token': localStorage.getItem('token') || ''
            }
        }).then(response => {
            //console.log(response)
            return response.json()}).then(data => {
            console.log(data)
            setFileList(data)
            console.log(fileList)
        })
    }, [])

    const handleFileDownload = async (fileId: number) => {
        const fileDownloadResponse = await getFileData(fileId)

        const toast = createStandaloneToast()
        
        toast({
            title: fileDownloadResponse ? 'Download Successful' : 'Download Failed',
            status: fileDownloadResponse ? 'success' : 'error',
            duration: 3000,
            isClosable: true
        })
    }

    if (fileList.length === 0) {
        return null
    }
    const deleteFile = async (fileId: number) => {
        // const response = await fetch('http://localhost:5000/deleteFile', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         fileId
        //     })
        // })
        console.log("Deleting the note with id" + fileId);
        const newFiles = fileList.filter((note)=>{return note.fileId!==fileId})
        setFileList(newFiles)
    }

    return (
        <div className='row my-3'>
            <Text
                fontSize="2xl"
                mb="4"
            >Uploaded Files</Text>
            {fileList.map(({ fileId, fileName, comment }) => (
                        <div className="col-md-4" key={fileId}>
                            <div className="card my-3 text-center d-flex">
                            <div className="card-header">
                                File : {fileName}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title"><b>Comment:</b></h5>
                                <p className="card-text">{comment}</p>
                                <Link to="/" onClick={() => handleFileDownload(fileId)} className="btn btn-primary">Download File</Link>
                            </div>
                            <div className="card-footer text-muted">
                                2 days ago
                            </div>
                        </div>
                        </div>
                        
                        
                    
                ))}
        </div>
        
            
            
                
                     
                
            
        
    )
}

export default FileList