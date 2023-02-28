interface UploadedFile {
    uid:number,
    originalFileName: string,
    uniqueFileName: string,
    fileSize: number,
    fileExtension: string,
    comment:string,
}

export default UploadedFile