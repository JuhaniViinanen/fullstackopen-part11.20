import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import SuccessMessage from './components/SuccessMessage'
import ErrorMessage from './components/ErrorMessage'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

function App() {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs.sort( (a,b) => b.likes - a.likes )))
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showSuccessMessage = message => {
    setSuccessMessage(message)
    setTimeout( () => setSuccessMessage(''), 5000 )
  }

  const showErrorMessage = message => {
    setErrorMessage(message)
    setTimeout( () => setErrorMessage(''), 5000 )
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      showSuccessMessage('login succesful.')
    } catch (exception) {
      showErrorMessage(`${exception.response.data.error}`)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.setToken(null)
    showSuccessMessage('logout successful.')
  }

  const handleNewBlogCreation = async newBlog => {
    try {
      const res = await blogService.create(newBlog)
      console.log()
      setBlogs(blogs.concat({ ...res, user: user }))
      showSuccessMessage(`blog ${res.title} created.`)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      showErrorMessage(`${exception.response.data.error}`)
    }
  }

  const handleLike = async (blogId, newLikes) => {
    try {
      const res = await blogService.like(blogId, newLikes)
      const newBlogs = blogs.map( blog =>
        blog.id === res.id ?
          { ...blog, likes: res.likes } :
          blog
      )
      newBlogs.sort( (a,b) => b.likes - a.likes)
      setBlogs(newBlogs)
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleDelete = async blog => {
    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs( blogs.filter(b => b.id !== blog.id) )
        showSuccessMessage(`${blog.title} by ${blog.author} deleted`)
      } catch (exception) {
        console.log(exception)
      }
    }
  }

  const blogsForm = () => (
    <div>
      <div>
        <p>{user.name} logged in</p>
        <button onClick={ handleLogout }>logout</button>
      </div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleNewBlogCreation} />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeFunction={handleLike}
          deleteFunction={handleDelete}
          appUser={user}
        />
      )}
    </div>
  )

  return (
    <div>
      {user === null ?
        <h2>log in to application</h2> :
        <h2>blogs</h2>
      }
      <SuccessMessage message={successMessage} />
      <ErrorMessage message={errorMessage} />
      {user === null ?
        <LoginForm loginFunction={handleLogin} /> :
        blogsForm()
      }
    </div>
  )
}

export default App
