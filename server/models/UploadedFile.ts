interface UploadedFile {
    uid:number,
    rid:number,
    reviewed:boolean,
    originalFileName: string,
    uniqueFileName: string,
    fileSize: number,
    fileExtension: string,
    comment:string,
}

export default UploadedFile