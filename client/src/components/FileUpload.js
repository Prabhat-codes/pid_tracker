import { SyntheticEvent, useState, Dispatch, SetStateAction } from 'react'
import {
    Box,
    Text,
    Flex,
    Button,
    Input,
    createStandaloneToast
} from '@chakra-ui/react'

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'
  import { Textarea } from '@chakra-ui/react'

import AcceptedFileTypesModal from './AcceptedFileTypesModal'
import { validateFileSize, validateFileType } from '../service/fileValidatorService'
import FileService from '../service/fileService'
//import { Form } from "react-final-form"
// interface Props {
//     setFileId: Dispatch<SetStateAction<number>>
// }



function FileUpload(props) {
    const {
        setFileId
    } = props
    const [isFileTypesModalOpen, setIsFilesTypeModalOpen] = useState(false)
    const [uploadFormError, setUploadFormError] = useState('')
    const [value,setvalue] = useState('')

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

        const fileService = new FileService(file[0],comment)
        const fileUploadResponse = await fileService.uploadFile2()

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
        <Box
            width="50%"
            m="100px auto"
            padding="2"
            shadow="base"
        >
            <Flex
                direction="column"
                alignItems="center"
                mb="5"
            >
                <Text fontSize="2xl" mb="4">Upload a Document</Text>
                <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => setIsFilesTypeModalOpen(true)}
                >
                    Accepted File Types
                </Button>
                {
                    uploadFormError &&
                    <Text mt="5" color="red">{uploadFormError}</Text>
                }
                <Box
                    mt="10"
                    ml="24"
                >
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
                        <button type="submit" className="btn btn-primary mb-3">Submit</button>
                    </form>
                    
                </Box>
            </Flex>
            <AcceptedFileTypesModal 
                isOpen={isFileTypesModalOpen}
                onClose={() => setIsFilesTypeModalOpen(false)}
            />
        </Box>
    )
}

export default FileUpload