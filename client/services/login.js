import axios from "axios"
axios.defaults.baseURL = "http://localhost:3003"
const baseURL = "/api/login"

const login = async credentials => {
  const res = await axios.post(baseURL, credentials)
  return res.data
}

export default { login }
