import axios from "axios";
import refreshAccessToken from "./token-service"; // Import the token refresh function

const api = process.env.REACT_APP_API_KEY

const axiosInstance = axios.create({
    baseURL: api, // Replace with your API base URL
});

// Add a variable to track whether a token refresh is in progress
let isRefreshing = false;

// Create an array to queue pending requests while the token is being refreshed
let pendingRequests = [];

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("access_token"); // Retrieve the access token (you may use a state management library)

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        //   console.log('jwt expired', response)
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 403 && error.response.data.message === "jwt expired") {
            // console.log('jwt expired', error.response.data.message)
            //if (!isRefreshing) {
                //isRefreshing = true;

                try {
                    const newAccessToken = await refreshAccessToken();

                    if (!newAccessToken) {
                        console.log(newAccessToken, 'refresh resp')
                        localStorage.clear()
                        window.location.href = "http://localhost:3000/login"
                        return
                    }

                    // Update the access token and clear the queue of pending requests
                    localStorage.setItem("access_token", newAccessToken);
                    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                    // originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    // pendingRequests.forEach((callback) => callback(newAccessToken));
                    // pendingRequests = [];
                    
                     // Update the request headers with the new access token
                    error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // Retry all requests in the queue with the new token
                    pendingRequests.forEach((callback) => callback(newAccessToken));
                    pendingRequests = [];

                    // Retry the original request
                    return axiosInstance(originalRequest);
                } 
                catch (refreshError) {
                    // Handle token refresh error (e.g., log the user out)
                    // Example: handleLogout();
                    // throw refreshError;
                } 
                finally {
                    isRefreshing = false;
                }
            //}

            // Queue the original request for retry after token refresh
            const retryOriginalRequest = new Promise((resolve) => {
                pendingRequests.push((token) => {
                    // originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    resolve(axiosInstance(originalRequest));
                });
            });

            return retryOriginalRequest;
        }
        else if (error.response.status === 401) {
            localStorage.clear()
            window.location.href = "http://localhost:3000/login"
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
