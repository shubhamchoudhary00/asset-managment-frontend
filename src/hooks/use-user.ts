import { IUser } from "@/interfaces/IUser";
import apiClient from "@/utils/apiClient";
import { useState } from "react";
import { toast } from "sonner";

interface PasswordPayload{
    newPassword:string;
    password:string;
}

interface ErrorResponse {
    response: {
      data: {
        message: string;
      };
    };
  }

const useUser=()=>{

    const [status,setStatus]=useState(false);

    const changePassword=async(payload:PasswordPayload)=>{
        try{
            const res=await apiClient.post("/user/change-password",payload);
            console.log(res.data);
            setStatus(true)
            return res.data;
        }catch(error:unknown){
            console.log(error)
            if (error as ErrorResponse) {
                if ((error as ErrorResponse).response && (error as ErrorResponse).response.data && (error as ErrorResponse).response.data.message) {
                  toast.error((error as ErrorResponse).response.data.message);
                  setStatus(false)
                }
              }
        }
    }

    const addUser=async(payload:IUser)=>{
        try{
            const res=await apiClient.post("/user/add-user",payload);
            return res.data;
        }catch(error){
            console.log(error);
        }
    }

    const updateUser=async(payload:IUser)=>{
        try{
            const res=await apiClient.post("/user/update-user",payload);
            console.log(res.data);
            return res.data;

        }catch(error){
            console.log(error);
        }
    }

    return {changePassword,addUser,status,updateUser};
}

export default useUser;