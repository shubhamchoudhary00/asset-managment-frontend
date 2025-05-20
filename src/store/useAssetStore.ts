import { IAsset, IAssetOverview } from "@/interfaces/IAsset";
import apiClient from "@/utils/apiClient";
import { create } from "zustand";


interface Props{
    assets:IAsset[] | null
    isLoading:boolean;
    inventory:IAssetOverview | null;
    initalize:()=>void;
    refetch:()=>void;

}

const useAssetStore=create<Props>((set,get)=>({
    assets:null,
    isLoading:true,
    inventory:null,

    initalize:()=>{
        const {assets,inventory}=get();
        if(assets ||  inventory){
            return;
        }

        const getAssets=async()=>{
            set({isLoading:true})
            try{
                const [res1,res2]=await Promise.all([apiClient.get("/assets"),apiClient.get("/assets/inventory/overview")]);
                console.log(res1.data.data,res2.data.data)
                set({assets:res1.data.data,inventory:res2.data.data})
            }catch(error){
                console.log(error)
                set({assets:null,inventory:null})
            }finally{
                set({isLoading:false})
            }
        }

        getAssets();

    },
    refetch:()=>{
       
        const getAssets=async()=>{
            set({isLoading:true})
            try{
                const [res1,res2]=await Promise.all([apiClient.get("/assets"),apiClient.get("/assets/overview")]);
                set({assets:res1.data.data,inventory:res2.data.data})
            }catch(error){
                console.log(error)

                set({assets:null,inventory:null,isLoading:false})
            }finally{
                set({isLoading:false})
            }
        }

        getAssets();

    },
}));

export default useAssetStore;