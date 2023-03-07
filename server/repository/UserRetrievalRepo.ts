import connection from '../db'
import User from '../models/User'
let instance: null|UserRetrievalRepo = null

class UserRetrievalRepo {
    static getInstance(): UserRetrievalRepo {
        if (instance === null) {
            instance = new UserRetrievalRepo()
        }
        return instance
    }
    constructor(){}

    // async findUsers(): Promise<Array<{ UserId: number, UserName: string }>> {
    //     try {
    //         return await new Promise((resolve, reject) => {
    //             const selects = [
    //                 'User_id AS UserId',
    //                 'User_name AS UserName'
    //             ]

    //             connection.query(
    //                 `SELECT ${selects.join(',')} FROM uploaded_User`,
    //                 [],
    //                 (error, results) => {
    //                     if (error) {
    //                         console.log(error)
    //                         reject([])
    //                     }
    //                     resolve(results)
    //                 }
    //             )
    //         })
    //     } catch (error) {
    //         return []
    //     }
    // }

    async findUserBymail(email:string): Promise<false | User> {
        try {
            return await new Promise((resolve, reject) => {
                // const selects = [
                //     'unique_User_name AS password',
                //     'User_name AS email'
                // ]

                connection.query(
                    `SELECT * FROM user WHERE email = ? LIMIT 1`,
                    [email],
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
    async findUserById(id:number): Promise<false | User> {
        try {
            return await new Promise((resolve, reject) => {
                // const selects = [
                //     'unique_User_name AS password',
                //     'User_name AS email'
                // ]

                connection.query(
                    `SELECT * FROM user WHERE user_id = ? LIMIT 1`,
                    [id],
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

    async getUserByStatus(id:number, status:boolean): Promise<false | User> {
        try {
            return await new Promise((resolve, reject) => {
                // const selects = [
                //     'unique_User_name AS password',
                //     'User_name AS email'
                // ]

                connection.query(
                    `SELECT * FROM user WHERE user_id <> ? AND currently_reviewing = ? LIMIT 1`,
                    [id,status],
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

    async changeUserStatus(id:number,status:boolean) : Promise<boolean>{
        try {
            return await new Promise((resolve, reject) => {
                connection.query(
                    `UPDATE user 
                     SET currently_reviewing =?
                     WHERE user_id =?`,
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
}

export default UserRetrievalRepo.getInstance()