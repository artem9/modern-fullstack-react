import { useState } from 'react'
import { useMutation as useGraphQLMutation } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import slug from 'slug'

import { useAuth } from '../hooks/useAuth.js'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../api/graphql/posts.js'

export function CreatePost() {
  const [token] = useAuth()
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')

  const [createPost, { loading, data }] = useGraphQLMutation(CREATE_POST, {
    variables: { title, contents },
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPost()
  }

  if (!token) return <div>Please log in to create new posts.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          id='create-title'
          name='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
      />
      <br />
      <br />
      <input
        type='submit'
        value={loading ? 'Creating...' : 'Create'}
        disabled={!title || loading}
      />
      {data?.createPost ? (
        <>
          <br />
          Post{' '}
          <Link
            to={`/posts/${data.createPost.id}/${slug(data.createPost.title)}`}
          >
            {data.createPost.title}
          </Link>{' '}
          created successfully!
        </>
      ) : null}
    </form>
  )
}
