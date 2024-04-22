import axiosInstance from "./axios";

const refreshAccessToken = async (refreshToken) => {
  try {
    const refreshToken = localStorage.getItem("refresh_token"); 
    if(!refreshToken) return "No refresh token available"
    const response = await axiosInstance.post("/auth/refresh-token", {
      refreshToken,
    });
    if(response.data.status_code == 200) {
        const newAccessToken = response.data['access_token'];
        return newAccessToken;
    }
    else if(response.data.status_code == 403){
        return false
    }
    // Store the new access token in your application state or localStorage
    // Example: localStorage.setItem("accessToken", newAccessToken);
  } catch (error) {
    // Handle token refresh error (e.g., log the user out)
    // Example: handleLogout();

    throw error;
  }
};

export default refreshAccessToken;
