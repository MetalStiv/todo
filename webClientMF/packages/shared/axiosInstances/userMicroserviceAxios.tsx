import axios, { AxiosInstance } from "axios";
import { userMicroserviceBaseUrl } from "../const";

const userMicroserviceAxios: AxiosInstance = axios.create({
    baseURL: userMicroserviceBaseUrl
});

userMicroserviceAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

userMicroserviceAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const deviceId: string = localStorage.getItem('deviceId') ?? '';
                const refreshToken: string = localStorage.getItem('refreshToken') ?? '';
                const response = await userMicroserviceAxios.post('refresh', {
                    deviceId: deviceId,
                    refreshToken: refreshToken
                });
                const { newAccessToken, newRefreshToken } = response.data;

                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } 
            catch (error) {
                console.log(error)
            }
        }

        return Promise.reject(error);
    }
);

export {userMicroserviceAxios}