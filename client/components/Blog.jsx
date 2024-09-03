import { useState } from 'react'
import PropTypes from 'prop-types'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({ blog, likeFunction , deleteFunction, appUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const simple = () => (
    <div>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(true)}>more</button>
      </div>
    </div>
  )

  const details = () => (
    <div>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(false)}>less</button>
      </div>
      <div>{blog.url}</div>
      <div>
        {blog.likes}
        <button onClick={() => likeFunction(blog.id, blog.likes + 1)}>like</button>
      </div>
      <div>{blog.user.name}</div>
      {( blog.user.username === appUser.username ) &&
              <button onClick={() => deleteFunction(blog)}>delete</button>
      }
    </div>
  )

  return (
    <div style={blogStyle} className="blog">
      {detailsVisible ? details() : simple()}
    </div>

  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeFunction: PropTypes.func.isRequired,
  deleteFunction: PropTypes.func.isRequired,
  appUser: PropTypes.object.isRequired
}

export default Blog
