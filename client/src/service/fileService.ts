interface UploadFileResponse {
    success: boolean,
    message: string
}

class FileService 
{
    private file: File
    private comment:string

    constructor(file: File,comment:string) {
        this.file = file
        this.comment = comment
    }

    static getFileExtension(fileName: string): string {
        const fileNames: Array<string> = fileName.split('.')

        if (fileNames.length === 0) {
            return ''
        }

        return fileNames[fileNames.length - 1]
    }

    async uploadFile(): Promise<UploadFileResponse> {
        const uploadResponse = await fetch('http://localhost:5000/uploadFile', {
            method: 'POST',
            
            body: this.getFormData()
        })

        const responseJson = await uploadResponse.json()

        if (responseJson.success === false) {
            return {
                success: false,
                message: responseJson.message
            }
        }

        return {
            success: true,
            message: 'Uploaded Successfully'
        }
    }
    async uploadFile2(): Promise<UploadFileResponse> {
        const uploadResponse = await fetch('http://localhost:5000/api/developer/uploadfile', {
            method: 'POST',
            headers:{
                'auth-token':localStorage.getItem('token') || ''
            },
            body: this.getFormData()
        })

        const responseJson = await uploadResponse.json()

        if (responseJson.success === false) {
            return {
                success: false,
                message: responseJson.message
            }
        }

        return {
            success: true,
            message: 'Uploaded Successfully'
        }
    }

    private getFormData(): FormData {
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('comment', this.comment)
        
        
            formData.append('pass',localStorage.getItem('pass')!)
        
        return formData
    }
}

export default FileService