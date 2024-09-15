import axios from 'axios'

const PORT = import.meta.env.VITE_PORT

axios.defaults.baseURL = import.meta.env.MODE === 'production'
  ? `https://localhost:${PORT}`
  : `http://localhost:${PORT}`

const baseURL = '/api/login'

const login = async credentials => {
  const res = await axios.post(baseURL, credentials)
  return res.data
}

export default { login }
