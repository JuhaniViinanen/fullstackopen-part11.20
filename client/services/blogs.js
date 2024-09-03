import axios from 'axios'

const PORT = process.env.PORT ? process.env.PORT : import.meta.env.VITE_PORT

axios.defaults.baseURL = `http://localhost:${PORT}`
const baseURL = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const res = await axios.get(baseURL)
  return res.data
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.post(baseURL, newBlog, config)
  return res.data
}

const like = async (blogID, newLikes) => {
  const res = await axios.put(`${baseURL}/${blogID}`, { likes: newLikes })
  return res.data
}

const remove = async blogID => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.delete(`${baseURL}/${blogID}`, config)
  return res.data
}

export default { setToken, getAll, create, like, remove }
