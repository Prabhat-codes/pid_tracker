interface UploadedFile {
    uid?:number,
    originalFileName: string,
    uniqueFileName: string,
    fileSize: number,
    fileExtension: string
}

export default UploadedFile