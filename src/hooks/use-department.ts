"use client"

import apiClient from "@/utils/apiClient";
import {  useState } from "react"



const useDepartment=()=>{

    const [department,setDepartment]=useState<string[] | null>(null);
    const [isLoading,setIsLoading]=useState<boolean>(false);
    const [error,setError]=useState<unknown | null>(null);

    const getDepartments=async()=>{
        setIsLoading(true)
        try{
            const res=await apiClient.get("/department");
            console.log(res.data)
            setDepartment(res.data);
        }catch(error:unknown){
            setError(error)
        }finally{
            setIsLoading(false)
        }
    }


    const addDepartment=async(name:string)=>{
        setIsLoading(true)
        try{
            const res=await apiClient.post("/department",{name:name});
            return res.data;
        }catch(error:unknown){
            setError(error)
        }finally{
            setIsLoading(false)
        }
    }

    return {department,isLoading,error,getDepartments,addDepartment}
}

export default useDepartment