import express from 'express'
import path from 'path'
import { validateFileSize, validateFileType } from '../service/fileValidatorService'
import FileUploadService from '../service/fileUploadService'
import fileRetrievalService from '../service/FileRetrievalService'

let instance: null | FileController = null

class FileController
{
    static getInstance(): FileController {
        if (instance === null) {
            instance = new FileController()
            return instance
        }

        return instance
    }

    async uploadFile(request: express.Request, response: express.Response) {
        try {
            const file = request.file

            const validFileType = await validateFileType(path.extname(file.originalname))
            const validFileSize = await validateFileSize(file.size)

            if (!validFileType.isValid || !validFileSize.isValid) {
                return response.status(400).json({
                    success: false,
                    message: 'Invalid Request'
                })
            }

            const fileUploadService = new FileUploadService(file)
            const fileId = await fileUploadService.createFileUpload()

            if (fileId === 0) {
                return response.status(500).json({
                    success: false,
                    message: 'Error uploading file'
                })
            }

            response.json({
                success: true,
                fileId
            })
        } catch (error) {
            response.json({
                success: false,
                message: 'Error uploading file'
            })
        }
    }

    async getFiles(request: express.Request, response: express.Response) {
        try {
            const files = await fileRetrievalService.findFiles()

            response.json({
                success: true,
                files
            })
        } catch (error) {
            response.json({
                success: false,
                message: 'Error retrieving files'
            })
        }
    }

    async downloadFile(request: express.Request, response: express.Response) {
        const fileId = parseInt(request.params.id)

        //const validId = await validateInteger(fileId)

        // if (!validId.isValid) {
        //     return response.status(400).json({
        //         success: false,
        //         message: 'Invalid Request'
        //     })
        // }

        try {
            const fileDetails = await fileRetrievalService.downloadFile(fileId)

            if (fileDetails === false) {
                return response.status(404).json({
                    success: false,
                    message: 'File not found'
                })
            }

            response.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-disposition': `attachment; "filename=${fileDetails.fileName}"`
            })
            response.write(fileDetails.fileData)
            response.end()
        } catch (error) {
            response.json({
                success: false,
                message: 'Error retrieving files'
            })
        } 
    }
}

export default FileController.getInstance()