import { useState, useEffect , useContext, useRef } from 'react'
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
import FileUpload from './FileUpload'
import { validateFileSize, validateFileType } from '../service/fileValidatorService'
import FileService from '../service/fileService'
// interface Props {
//     fileId: number
// }

function FileList(props) {
    const {
        fileId
    } = props
    const ref = useRef(null)
    const refClose = useRef(null)
    const refSubmit = useRef(null)
    //const context = useContext(FileContext);
    //const {Files, getFiles} = context;
    const host = "http://localhost:5000"
    const [fileList, setFileList] = useState([])
    const [efile,setFile] = useState({fileId:-1, fileName: "" , comment:""})
    const [isFileTypesModalOpen, setIsFilesTypeModalOpen] = useState(false)
    const [uploadFormError, setUploadFormError] = useState('')
    const [value,setvalue] = useState('')

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
            setFileList(data.reverse())
            console.log(fileList)
        })
    }, [])

    const handleFileDownload = async (fileId) => {
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
    
    const deleteFile = async (fileID) => {
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
        const newFiles = fileList.filter((note)=>{return fileList.fileId!==fileId})
        setFileList(newFiles)
    }

    const handleFileUpdate =async (efileId,efileName,ecomment) => {
        if(ref.current)
        {
            ref.current.click();
            setFile({fileId:efileId,fileName:efileName,comment:ecomment});

        }
        
    }
    const handleClick = (e)=>{ 
        refSubmit.current.click();
        refClose.current.click();
    }

    const onChange = (e) => {
        setFile({...efile, [e.target.name]: e.target.value})
    }
    const handleInputChange = (e) => {
        let inputValue = e.target.value
        setvalue(inputValue)
      }
      const handleSubmit = async (e) =>{
        console.log(e.target[0].value);
        handleFileUpload(e.target[1],e.target[0].value)
        e.preventDefault();
        
      }
      const handleFileUpload = async (element,comment) => {
        //element.preventDefault()
        console.log(element)
        const file = element.files
        
        if (!file) {
            return
        }
        
        const validFileSize = await validateFileSize(file[0].size)
        const validFileType = await validateFileType(FileService.getFileExtension(file[0].name))

        if (!validFileSize.isValid) {
            setUploadFormError(validFileSize.errorMessage)
            return
        }

        if (!validFileType.isValid) {
            setUploadFormError(validFileType.errorMessage)
            return
        }
        
        if (uploadFormError && validFileSize.isValid) {
            setUploadFormError('')
        }
        console.log(file)
        const fileService = new FileService(file[0],comment)
        const fileUploadResponse = await fileService.uploadFile3(efile.fileId)

        element.value = ''

        const toast = createStandaloneToast()

        toast({
            title: fileUploadResponse.success ? 'File Uploaded' : 'Upload Failed',
            description: fileUploadResponse.message,
            status: fileUploadResponse.success ? 'success' : 'error',
            duration: 3000,
            isClosable: true
        })
        //setFileId(fileUploadResponse.fileId ?? 0)
    }

    return (
        <>
        <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
        </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Send Review</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="my-3">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">File Name</label>
                                    <input type="text" disabled={true} className="form-control" id="etitle" name="etitle" value={efile.fileName} aria-describedby="emailHelp" onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Comment</label>
                                    <input type="text" disabled={true} className="form-control" id="edescription" name="edescription" value={efile.comment} onChange={onChange} />
                                </div>
                            </form>
                            <form  onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Add Comments</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" onChange={handleInputChange}
                                    placeholder='Add Comments'></textarea>
                                </div>
                                {/* <FormLabel>Add File</FormLabel> */}
                                {/* <Input
                                    type="file"
                                    variant="unstyled"
                                    //onChange={(e: SyntheticEvent) => handleFileUpload(e.currentTarget as HTMLInputElement)}
                                /> */}
                                <div className="mb-3">
                                    <label htmlFor="formFile" className="form-label">Add File</label>
        -                            <input className="form-control" type="file" id="formFile" 
                                            //onChange={(e) => handleFileUpload(e.currentTarget)}
                                            />
                                </div>
                                <button ref={refSubmit} type="submit" className="btn btn-primary mb-3 d-none">Submit</button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button  onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>



        <div className='row my-3'>
            
            {fileList.map(({ fileId, fileName, comment }) => (
                        <div className="col-md-4" key={fileId}>
                            <div className="card my-3 text-center d-flex">
                            <div className="card-header">
                                File : {fileName}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title"><b>Comment:</b></h5>
                                <p className="card-text my-3">{comment}</p>
                                <Link to="/" onClick={() => handleFileDownload(fileId)} className="btn btn-outline-primary mx-3">Download File</Link>
                                <Link to="/" onClick={() => handleFileUpdate(fileId,fileName,comment)} className="btn btn-outline-primary">Review</Link>
                            </div>
                            <div className="card-footer text-muted">
                                2 days ago
                            </div>
                        </div>
                        </div>
                        
                        
                    
                ))}
        </div>
        </>    
    )
}

export default FileList