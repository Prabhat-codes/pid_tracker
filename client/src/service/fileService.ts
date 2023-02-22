interface UploadFileResponse {
    success: boolean,
    message: string
}

class FileService 
{
    private file: File

    constructor(file: File) {
        this.file = file
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
        const uploadResponse = await fetch('http://localhost:5000/api/files/addfile', {
            method: 'POST',
            headers:{
                'auth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo5fSwiaWF0IjoxNjc3MDg2NzI1fQ.neuM7WAF0N05J-VRjbEgA3tqD6nEj9weHowdfWe3pOQ'
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
        return formData
    }
}

export default FileService