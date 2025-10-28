import axios from "axios";
import authService from "../../services/auth_service";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const user = authService.getUser();
  const token = authService.getToken();

  config.params = {
    ...(config.params || {}),
    user_id: user?.user_id ? String(user.user_id) : undefined,
    token,
  };

  console.log("📤 Axios Request:", config.url, config.params);

  return config;
});

export default instance;
