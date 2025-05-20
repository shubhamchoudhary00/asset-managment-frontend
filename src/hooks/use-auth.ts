import apiClient from "@/utils/apiClient"


const useAuth=()=>{


    const login=async(payload:{name:string,password:string})=>{
        try{
            const res=await apiClient.post("/auth/login",payload);
            return res.data

        }catch(error){
            
            return error
        }
    }


    return {login}
}

export default useAuth