
import axios from "axios"

const EXCLUDED_POINTS=["/auth/login"];

const apiClient=axios.create({
    baseURL:process.env.NEXT_PUBLIC_BASE_URL,
    headers:{"Content-Type":"application/json"}
});

apiClient.interceptors.request.use(
    (config)=>{
        const token=typeof window !=="undefined" ? localStorage.getItem("token") :null;

        if(token && !EXCLUDED_POINTS.includes(config.url ?? "")){
            config.headers["Authorization"]=`Bearer ${token}`;
        }

        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)


export default apiClient