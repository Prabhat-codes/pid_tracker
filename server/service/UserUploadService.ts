import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import UserRepo from '../repository/UserRepo'
import User from '../models/User'

class UserUploadService
{
    private file: User

    constructor(file: User) {
        this.file = file
    }
    async createFileUpload(): Promise<number> {
        //const uniqueFileName = this.createUniqueFileName()
        const fileId = await this.createUserRecord()
        
        // this.writeToFileStream(uniqueFileName)

        return fileId
    }

    // private createUniqueFileName(): string {
    //     const timeStamp = new Date().toISOString().replace(/[-:.TZ]/g, "")
    //     return `${uuidv4()}_${timeStamp}${this.getFileExtension()}`
    // }

    private async createUserRecord(): Promise<number> {
        return await UserRepo.createUserRecord({
                UserName: this.file.UserName,
                email:this.file.email,
                password:this.file.password,
                currently_reviewing:this.file.currently_reviewing
        })
    }

    // private writeToFileStream(uniqueFileName: string) {
    //     const fileStream = fs.createWriteStream(`${__dirname}/../img/${uniqueFileName}`)

    //     fileStream.write(this.file.buffer, 'base64')

    //     fileStream.on('error', () => {
    //         console.log('error occurred while writing to stream')
    //     })
        
    //     fileStream.end()
    // }
}

export default UserUploadService