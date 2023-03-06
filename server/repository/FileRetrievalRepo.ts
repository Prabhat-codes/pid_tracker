import connection from '../db'
import File from '../models/UploadedFile'
let instance: null|FileRetrievalRepo = null

class FileRetrievalRepo {
    static getInstance(): FileRetrievalRepo {
        if (instance === null) {
            instance = new FileRetrievalRepo()
        }
        return instance
    }
    constructor(){}

    async findFiles(): Promise<Array<{ fileId: number, fileName: string }>> {
        try {
            return await new Promise((resolve, reject) => {
                const selects = [
                    'file_id AS fileId',
                    'file_name AS fileName'
                ]

                connection.query(
                    `SELECT ${selects.join(',')} FROM uploaded_file`,
                    [],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            reject([])
                        }
                        resolve(results)
                    }
                )
            })
        } catch (error) {
            return []
        }
    }
    async findFileByUid(uId: number): Promise<false | { fileId: number, fileName: string , comment:string }> {
        try {
            return await new Promise((resolve, reject) => {
                const selects = [
                    'file_id AS fileId',
                    'file_name AS fileName',
                    'comment AS comment',
                ]

                connection.query(
                    `SELECT ${selects.join(',')} FROM uploaded_file WHERE user_id = ?`,
                    [uId],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            reject(false)
                        }
                        //console.log(results)
                        resolve(results)
                    }
                )
            })
        } catch (error) {
            return false
        }
    }
    async findFileById(fileId: number): Promise<false | { uniqueFileName: string, fileName: string, developerID:number }> {
        try {
            return await new Promise((resolve, reject) => {
                const selects = [
                    'unique_file_name AS uniqueFileName',
                    'file_name AS fileName',
                    'user_id AS developerID',
                ]

                connection.query(
                    `SELECT ${selects.join(',')} FROM uploaded_file WHERE file_id = ? LIMIT 1`,
                    [fileId],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            reject(false)
                        }
                        console.log(results)
                        resolve(results[0])
                    }
                )
            })
        } catch (error) {
            return false
        }
    }

    async findPendingFilesforReview(userId: number): Promise<false | { fileId: number, fileName: string, comment:string }> {
        try {
            return await new Promise((resolve, reject) => {
                const selects = [
                    'file_id AS fileId',
                    'file_name AS fileName',
                    'comment AS comment',
                ]

                connection.query(
                    `SELECT ${selects.join(',')} FROM uploaded_file WHERE reviewer_id = ? AND reviewed = false LIMIT 1`,
                    [userId],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            reject(false)
                        }
                        console.log(results)
                        resolve(results)
                    }
                )
            })
        } catch (error) {
            return false
        }
    }

    async findFilesforDev(userId: number,rev:boolean): Promise<false | { fileId: number, fileName: string, comment:string }> {
        try {
            return await new Promise((resolve, reject) => {
                const selects = [
                    'file_id AS fileId',
                    'file_name AS fileName',
                    'comment AS comment',
                ]

                connection.query(
                    `SELECT ${selects.join(',')} FROM uploaded_file WHERE user_id = ? AND reviewed = ? LIMIT 1`,
                    [userId,rev],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            reject(false)
                        }
                        console.log(results)
                        resolve(results)
                    }
                )
            })
        } catch (error) {
            return false
        }
    }

    async findReviewedFiles(userId: number): Promise<false | { uniqueFileName: string, fileName: string }> {
        try {
            return await new Promise((resolve, reject) => {
                const selects = [
                    'unique_file_name AS uniqueFileName',
                    'file_name AS fileName'
                ]

                connection.query(
                    `SELECT ${selects.join(',')} FROM uploaded_file WHERE reviewer_id = ? AND reviewed = true LIMIT 1`,
                    [userId],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            reject(false)
                        }
                        resolve(results[0])
                    }
                )
            })
        } catch (error) {
            return false
        }
    }

    async changeFileStatus(id:number,status:boolean) : Promise<boolean>{
        try {
            return await new Promise((resolve, reject) => {
                connection.query(
                    `UPDATE uploaded_file 
                     SET reviewed =?
                     WHERE file_id =?`,
                    [status,id],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            reject(false)
                        }
                        console.log("Change User Status" + results)
                        resolve(true);
                    }
                ) 
            })
        } catch (error) {
            return false
        }
    }
    async deleteFileById(id:number) : Promise<boolean>{
        try {
            return await new Promise((resolve, reject) => {
                connection.query(
                    `DELETE FROM uploaded_file 
                     WHERE file_id =?`,
                    [id],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            reject(false)
                        }
                        console.log("Deleted File")
                        resolve(true);
                    }
                ) 
            })
        } catch (error) {
            return false
        }
    }

    // async findUserBymail(email:string): Promise<false | User> {
    //     try {
    //         return await new Promise((resolve, reject) => {
    //             // const selects = [
    //             //     'unique_User_name AS password',
    //             //     'User_name AS email'
    //             // ]

    //             connection.query(
    //                 `SELECT * FROM user WHERE email = ? LIMIT 1`,
    //                 [email],
    //                 (error, results) => {
    //                     if (error) {
    //                         console.log(error)
    //                         reject(false)
    //                     }
    //                     console.log(results)
    //                     resolve(results[0])
    //                 }
    //             )
    //         })
    //     } catch (error) {
    //         return false
    //     }
    // }
    // async findFileByUid(id:number): Promise<false | File> {
    //     try {
    //         return await new Promise((resolve, reject) => {
    //             // const selects = [
    //             //     'unique_User_name AS password',
    //             //     'User_name AS email'
    //             // ]

    //             connection.query(
    //                 `SELECT * FROM user WHERE uid = ? LIMIT 1`,
    //                 [id],
    //                 (error, results) => {
    //                     if (error) {
    //                         console.log(error)
    //                         reject(false)
    //                     }
    //                     console.log(results)
    //                     resolve(results[0])
    //                 }
    //             )
    //         })
    //     } catch (error) {
    //         return false
    //     }
    // }
}

export default FileRetrievalRepo.getInstance()