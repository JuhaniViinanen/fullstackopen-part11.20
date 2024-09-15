import axios from 'axios'

const PORT = process.env.PORT ? process.env.PORT : import.meta.env.VITE_PORT

axios.defaults.baseURL = `https://localhost:${PORT}`
const baseURL = '/api/login'

const login = async credentials => {
  const res = await axios.post(baseURL, credentials)
  return res.data
}

export default { login }
