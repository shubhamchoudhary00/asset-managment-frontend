import { IAsset } from "@/interfaces/IAsset"
import apiClient from "@/utils/apiClient";


const useAsset=()=>{

    const addAsset=async(payload:IAsset)=>{
        try{
            const res=await apiClient.post("/assets",payload);
            // console.log(res.data.data)
            return res;
        }catch(error){
            return error;
        }
    }
    const updateAsset=async(id:string,payload:IAsset)=>{
        try{
            const res=await apiClient.put(`/assets/${id}`,payload);
            // console.log(res.data)
            return res.data;
        }catch(error){
            return error;
        }
    }

    return {addAsset,updateAsset};
}

export default useAsset