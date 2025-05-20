
import { ICategory } from "@/interfaces/interface";
import apiClient from "@/utils/apiClient";
import {create} from "zustand"

interface Props{
    assetCategories:ICategory[] | null;
    initialize:()=>void;
    refetch:()=>void;
}

const useDashboardStore=create<Props>((set,get)=>({
    assetCategories:null,
    initialize:()=>{
        const {assetCategories}=get();
        if(assetCategories) return;

        const getData=async()=>{
            try{
                const res=await apiClient.get("/dashboard/asset-category");
                console.log(res.data)
                set({assetCategories:res.data.data})

            }catch(error){
                console.log(error)

                set({assetCategories:null})
            }
        }
        getData();
    },
    
    refetch:()=>{
     
        const getData=async()=>{
            try{
                const res=await apiClient.get("/dashboard/asset-category");
                console.log(res.data)
                set({assetCategories:res.data.data})

            }catch(error){
                console.log(error)

                set({assetCategories:null})
            }
        }
        getData();
    },

}))

export default useDashboardStore;