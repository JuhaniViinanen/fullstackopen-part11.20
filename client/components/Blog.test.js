import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    'title': 'Title of the blog',
    'author': 'Author of the blog',
    'url': 'URL address of the blog',
    'likes': 0,
    'user': {
      'username': 'username of the blog\'s creator'
    }
  }

  const user = {
    'username': 'username of the blog\'s creator'
  }

  test('renders title and author only by default', async () => {
    render(
      <Blog
        blog={blog}
        likeFunction={jest.fn()}
        deleteFunction={jest.fn()}
        appUser={user}
      />
    )
    await screen.findByText(blog.title, { exact: false })
    await screen.findByText(blog.author, { exact: false })
    expect(screen.queryByText(blog.url, { exact: false })).toBeNull()
    expect(screen.queryByText(blog.likes, { exact: false })).toBeNull()
  })

  test('shows url and likes after "more" button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Blog
        blog={blog}
        likeFunction={jest.fn()}
        deleteFunction={jest.fn()}
        appUser={user}
      />
    )
    const moreButton = await screen.findByText('more')
    fireEvent.click(moreButton)
    await screen.findByText(blog.url, { exact: false })
    await screen.findByText(blog.likes, { exact: false })
  })

  test('like function is called twice when like button is clicked twice', async () => {
    const user = userEvent.setup()
    const addLike = jest.fn()
    render(
      <Blog
        blog={blog}
        likeFunction={addLike}
        deleteFunction={jest.fn()}
        appUser={user}
      />
    )
    const moreButton = await screen.findByText('more')
    fireEvent.click(moreButton)
    const likeButton = await screen.findByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(addLike.mock.calls).toHaveLength(2)
  })
})
