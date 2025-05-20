import { ILocation } from "@/interfaces/interface";
import apiClient from "@/utils/apiClient";
import { create } from "zustand"


interface Props{
    locations:null | ILocation[];

    setLocation:(data:null | ILocation[])=>void;
    initalize:()=>void;
    refetch:()=>void;

}

const useLocationStore=create<Props>((set,get)=>({
    locations:null,
    setLocation:(data:ILocation[] | null)=>{
        set({locations:data});
    },
    initalize:()=>{
        const {locations}=get();
        if(locations){
            return;
        }
        const getLocations=async()=>{
            try{
                const res=await apiClient.get("/location");
                set({locations:res.data.data});
            }catch(error){
                console.log(error)

                set({locations:null})
            }
        }
        getLocations();
     
    },
    refetch:()=>{
     
        const getLocations=async()=>{
            try{
                const res=await apiClient.get("/location");
                set({locations:res.data.data});
            }catch(error){
                console.log(error)

                set({locations:null})
            }
        }
        getLocations();
     
    },
}));

export default useLocationStore;