import { ICategory } from "@/interfaces/interface";
import apiClient from "@/utils/apiClient";
import { create } from "zustand"


interface Props{
    category:null | ICategory[];

    setCategory:(data:null | ICategory[])=>void;
    initalize:()=>void;
    refetch:()=>void;

}

const useCategoryStore=create<Props>((set,get)=>({
    category:null,
    setCategory:(data:ICategory[] | null)=>{
        set({category:data});
    },
    initalize:()=>{
        const {category}=get();
        if(category){
            return;
        }
        const getCategory=async()=>{
            try{
                const res=await apiClient.get("/category");
                console.log(res.data)
                set({category:res.data.data});
            }catch(error){
                console.log(error)

                set({category:null})
            }
        }
        getCategory();
     
    },
    refetch:()=>{
     
        const getCategory=async()=>{
            try{
                const res=await apiClient.get("/category");
                set({category:res.data.data});
            }catch(error){
                console.log(error)

                set({category:null})
            }
        }
        getCategory();
     
    },
}));

export default useCategoryStore;