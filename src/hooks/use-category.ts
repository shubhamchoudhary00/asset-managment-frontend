"use client"

import apiClient from "@/utils/apiClient";
import {  useState } from "react"



const useCategory=()=>{

    const [category,setCategory]=useState<string[] | null>(null);
    const [isLoading,setIsLoading]=useState<boolean>(false);
    const [error,setError]=useState<unknown | null>(null);

    const getCategories=async()=>{
        setIsLoading(true)
        try{
            const res=await apiClient.get("/category");
            console.log(res.data)
            setCategory(res.data);
        }catch(error:unknown){
            setError(error)
        }finally{
            setIsLoading(false)
        }
    }


    const addCategory=async(name:string)=>{
        setIsLoading(true)
        try{
            const res=await apiClient.post("/category",{name:name});
            return res.data;
        }catch(error:unknown){
            setError(error)
        }finally{
            setIsLoading(false)
        }
    }

    return {category,isLoading,error,getCategories,addCategory}
}

export default useCategory