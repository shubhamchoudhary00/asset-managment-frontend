"use client"
import apiClient from "@/utils/apiClient";
import {  useState } from "react"



const useLocation=()=>{

    const [locations,setLocations]=useState<string[] | null>(null);
    const [isLoading,setIsLoading]=useState<boolean>(false);
    const [error,setError]=useState<unknown | null>(null);

    const getLocations=async()=>{
        setIsLoading(true)
        try{
            const res=await apiClient.get("/location");
            setLocations(res.data);
        }catch(error:unknown){
            setError(error)
        }finally{
            setIsLoading(false)
        }
    }


    const addLocation=async(name:string)=>{
        setIsLoading(true)
        try{
            const res=await apiClient.post("/location",{name:name});
            return res.data;
        }catch(error:unknown){
            setError(error)
        }finally{
            setIsLoading(false)
        }
    }

    return {locations,isLoading,error,getLocations,addLocation}
}

export default useLocation