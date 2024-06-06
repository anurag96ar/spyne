import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import { useSelector,useDispatch } from "react-redux";
import { setLogout } from '../state/state';





export const instance = axios.create({
    baseURL: 'http://localhost:3001',
     // Replace with your actual base URL
  });

  
export const createAxiosInstance = (params) => {
   


instance.interceptors.request.use(
  (config) => {
    const accessToken = params.accessToken
   
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config;
  },
  (error) => {
    console.log("interceptor error");
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error,"axios error here");
    if(error.code==="ECONNABORTED") toast.error("This request tooking long to respond",{position:toast.POSITION.TOP_CENTER})
   else if (error.response.status === 403) {
      toast.error(`${error.response.data.message}`,{position:toast.POSITION.TOP_CENTER})
      localStorage.removeItem('token')
      window.location.href = '/';

    }
    else{
      toast.error(`${error.response.data.message}`,{position:toast.POSITION.TOP_CENTER})
    }
    return Promise.reject(error);

  }
);
}

