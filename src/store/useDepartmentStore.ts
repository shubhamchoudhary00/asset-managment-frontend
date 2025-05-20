import { IDepartment } from "@/interfaces/interface";
import apiClient from "@/utils/apiClient";
import { create } from "zustand"


interface Props{
    departments:null | IDepartment[];

    setDepartments:(data:null | IDepartment[])=>void;
    initalize:()=>void;
    refetch:()=>void;

}

const useDepartmentStore=create<Props>((set,get)=>({
    departments:null,
    setDepartments:(data:IDepartment[] | null)=>{
        set({departments:data});
    },
    initalize:()=>{
        const {departments}=get();
        if(departments){
            return;
        }
        const getDepartments=async()=>{
            try{
                const res=await apiClient.get("/department");
                set({departments:res.data.data});
            }catch(error){
                console.log(error)

                set({departments:null})
            }
        }
        getDepartments();
     
    },
    refetch:()=>{
     
        const getDepartments=async()=>{
            try{
                const res=await apiClient.get("/department");
                set({departments:res.data.data});
            }catch(error){
                console.log(error)

                set({departments:null})
            }
        }
        getDepartments();
     
    },
}));

export default useDepartmentStore;