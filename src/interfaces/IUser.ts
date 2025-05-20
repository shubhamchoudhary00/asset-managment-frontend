

export interface IUser{
    _id?:string;
    name:string;
    password:string;
    role:string;
    location:string;
    department:string;
    addedBy:string | IUser;
    createdAt?:string | Date;

};