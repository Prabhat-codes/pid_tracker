interface User {
    user_id?: number;
    UserName: string,
    email:string,
    password:string,
    currently_reviewing:boolean,
    sent_id?:number,
    received_id?:number
}

export default User