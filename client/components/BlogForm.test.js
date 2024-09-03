import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> submits with the right values on submit', async () => {
  const user = userEvent.setup()
  const submissionHandler = jest.fn()

  const testData = {
    title: 'This is a test',
    author: 'Spongebob',
    url: 'http://spongeblog.com'
  }

  render(<BlogForm createBlog={submissionHandler} />)

  const titleInput = await screen.findByRole('textbox', { name: 'title:' })
  const authorInput = await screen.findByRole('textbox', { name: 'author:' })
  const urlInput = await screen.findByRole('textbox', { name: 'url:' })
  const createButton = await screen.findByRole('button', { name: 'create' })

  fireEvent.change(titleInput, { target: { value: testData.title } })
  fireEvent.change(authorInput, { target: { value: testData.author } })
  fireEvent.change(urlInput, { target: { value: testData.url } })
  fireEvent.click(createButton)

  expect(submissionHandler).toHaveBeenCalledTimes(1)
  expect(submissionHandler.mock.calls[0][0]).toEqual(testData)
})
