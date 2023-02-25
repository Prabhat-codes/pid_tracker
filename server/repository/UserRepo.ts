import connection from '../db'
import User from '../models/User'

let instance: null | UserRepo = null

class UserRepo {
    static getInstance(): UserRepo {
        if (instance === null) {
            instance = new UserRepo()
            return instance
        }

        return instance
    }

    async createUserRecord(user: User): Promise<number> {
        try {
            return await new Promise((resolve, reject) => {
                console.log("userrepo_hello")
                connection.query(
                    "INSERT INTO user (user_name,email,password,unique_file_name) VALUES (?,?,?,?)",
                    [
                        user.UserName,
                        user.email,
                        user.password,
                    ],
                    (error, results) => {
                        if (error) {
                            console.log(error.message)
                            reject(0)
                        }
                        console.log(results)
                        resolve(results.insertId)
                    }
                )
            })
        } catch (error) {
            
            console.log(error)
            return 0
        }
        
    } 
    // async createUserRecord(user: User): Promise<number> {
    //     try {
    //         return await new Promise((resolve, reject) => {
    //             console.log("userrepo_hello")
    //             connection.query(
    //                 "INSERT INTO user (user_name,email,password,unique_file_name) VALUES (?,?,?,?)",
    //                 [
    //                     user.UserName,
    //                     user.email,
    //                     user.password,
    //                     user.uniqueFileName,
    //                 ],
    //                 (error, results) => {
    //                     if (error) {
    //                         console.log(error.message)
    //                         reject(0)
    //                     }
    //                     console.log(results)
    //                     resolve(results.insertId)
    //                 }
    //             )
    //         })
    //     } catch (error) {
            
    //         console.log(error)
    //         return 0
    //     }
    // }
}

export default UserRepo.getInstance()