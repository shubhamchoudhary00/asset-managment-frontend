
import { IUser } from "@/interfaces/IUser"
import apiClient from "@/utils/apiClient";
import {create} from "zustand"

interface Props{
    user:null | IUser,
    allUsers:null | IUser[]
    setUser:(data:IUser | null)=>void;
    initalizeUser:()=>void;
    refetch:()=>void;
}

const useUserStore=create<Props>((set,get)=>({
    user:null,
    allUsers:null,
    setUser:(data:IUser | null)=>{
        set({user:data})
    },
    initalizeUser:()=>{
        const {user}=get();
        if(user){
            return;
        }

        const getUser=async()=>{
            try{
                const [res1,res2]=await Promise.all([apiClient.get("/user"),apiClient.get("/user/all")]);
                set({user:res1.data.data,allUsers:res2.data.data});
            }catch(error){
                console.log(error)

                set({user:null,allUsers:null});
            }
        }

        getUser();
    },
    refetch:()=>{
       

        const getUser=async()=>{
            try{
                const [res1,res2]=await Promise.all([apiClient.get("/user"),apiClient.get("/user/all")]);
                set({user:res1.data.data,allUsers:res2.data.data});
            }catch(error){
                console.log(error)

                set({user:null,allUsers:null});
            }
        }

        getUser();
    }
}));

export default useUserStore;