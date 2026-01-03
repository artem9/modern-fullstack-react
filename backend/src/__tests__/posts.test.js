import mongoose from 'mongoose'
import { beforeEach, describe, expect, test } from '@jest/globals'

import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'
import {
  createPost,
  deletePost,
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  updatePost,
} from '../services/posts.js'

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }
    const createdPost = await createPost(createdUser1._id, post)

    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)

    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('creating posts without title should fail', async () => {
    const post = {
      contents: 'This post with no title.',
      tags: ['empty'],
    }
    try {
      await createPost(createdUser1._id, post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }
    const createdPost = await createPost(createdUser1._id, post)

    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

const samplePosts = [
  { title: 'Learning Redux', tags: ['redux'] },
  { title: 'Learn React Hooks', tags: ['react'] },
  { title: 'Full-Stack React Projects', tags: ['react', 'nodejs'] },
  { title: 'Guide to TypeScript' },
]

const sampleUser1 = {
  username: 'Andy Stan',
  password: '12345',
}

const sampleUser2 = {
  username: 'Mike Smit',
  password: '43121',
}

let createdSamplePosts = []
let createdUser1 = undefined
let createdUser2 = undefined

beforeEach(async () => {
  await Post.deleteMany({})
  await User.deleteMany({})

  const user1 = new User(sampleUser1)
  const user2 = new User(sampleUser2)
  createdUser1 = await user1.save()
  createdUser2 = await user2.save()

  createdSamplePosts = []
  for (const [index, post] of samplePosts.entries()) {
    // update author property with a real user id
    const userId = index % 2 === 0 ? createdUser1._id : createdUser2._id
    const createdPost = new Post({
      ...post,
      author: userId,
    })
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })

  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor(createdUser1.username)
    expect(posts.length).toEqual(2)
  })

  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toEqual(1)
  })
})

describe('getting a post', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })

  test('should fail if the id does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(createdUser1._id, createdSamplePosts[0]._id, {
      tags: ['react', 'redux'],
    })
    const updatedPost = await Post.findOne({
      author: createdUser1._id,
      _id: createdSamplePosts[0]._id,
    })
    expect(updatedPost.tags).toEqual(['react', 'redux'])
  })

  test('should not update other properties', async () => {
    await updatePost(createdUser1._id, createdSamplePosts[0]._id, {
      tags: ['typescript'],
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
  })

  test('should update updatedAt timestamp', async () => {
    await updatePost(createdUser1._id, createdSamplePosts[0]._id, {
      title: 'Redux Toolkit',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const updatedPost = await updatePost(
      createdUser1._id,
      '000000000000000000000000',
      {
        tags: ['typescript'],
      },
    )
    expect(updatedPost).toEqual(null)
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(createdUser1._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deletePost('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
