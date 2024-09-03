const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const User = require("../models/user")

const api = supertest(app)

const initBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    }
]

const initUser = {
    username: "squidward",
    password: "tentacles",
    name: "Squidward"
}

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const blogs = initBlogs.map(blog => new Blog(blog))
    await Promise.all( blogs.map(blog => blog.save()) )
    const res = await api.post("/api/users").send(initUser)
})


describe("GET /api/blogs", () => {
    test("returns all blogs in database as json", async () => {
        const res = await api.get("/api/blogs")
        expect(res.status).toBe(200)
        expect(res.headers["content-type"]).toMatch(/application\/json/)
        expect(res.body).toHaveLength(initBlogs.length)
    })

    test("names the unique identifier of a blog as id", async () => {
        const res = await api.get("/api/blogs")
        expect(res.body[0].id).toBeDefined()
    })
})

describe("POST /api/blogs", () => {
    test("correctly saves the information posted into database", async () => {
        const newBlog = {
            title: "Living under the sea",
            author: "Spongebob Squarepants",
            url: "https://www.bikinibottom.se/blogs/livingunderthesea",
            likes: 13
        }
        const user = await api.post("/api/login").send({
            username: initUser.username,
            password: initUser.password
        })
        const res = await api
          .post("/api/blogs")
          .send(newBlog)
          .set("Authorization", `Bearer ${user.body.token}`)
        expect(res.status).toBe(201)
        expect(res.headers["content-type"]).toMatch(/application\/json/)
        delete res.body.id
        delete res.body.user
        delete res.body.comments
        expect(res.body).toEqual(newBlog)

        const getres = await api.get("/api/blogs")
        expect(getres.body).toHaveLength(initBlogs.length + 1)
    })

    test("uses a default value of 0 for the likes property", async () => {
        const newBlog = {
            title: "Living under the sea",
            author: "Spongebob Squarepants",
            url: "https://www.bikinibottom.se/blogs/livingunderthesea"
        }
        const user = await api.post("/api/login").send({
            username: initUser.username,
            password: initUser.password
        })
        const res = await api
          .post("/api/blogs")
          .send(newBlog)
          .set("Authorization", `Bearer ${user.body.token}`)
        expect(res.status).toBe(201)
        expect(res.headers["content-type"]).toMatch(/application\/json/)
        expect(res.body.likes).toBe(0)
    })

    test("responds with status code 400 when title or url are missing", async () => {
        const user = await api.post("/api/login").send({
            username: initUser.username,
            password: initUser.password
        })
        const noTitle = {
            author: "Spongebob Squarepants",
            url: "https://www.bikinibottom.se/blogs/livingunderthesea"
        }
        const noUrl = {
            title: "Living under the sea",
            author: "Spongebob Squarepants"
        }
        const resNoTitle = await api
          .post("/api/blogs").send(noTitle)
          .set("Authorization", `Bearer ${user.body.token}`)
        const resNoUrl = await api
          .post("/api/blogs").send(noUrl)
          .set("Authorization", `Bearer ${user.body.token}`)
        expect(resNoTitle.status).toBe(400)
        expect(resNoUrl.status).toBe(400)
    })

    test("responds with status code 401 when token is not provided", async () => {
        const newBlog = {
            title: "Living under the sea",
            author: "Spongebob Squarepants",
            url: "https://www.bikinibottom.se/blogs/livingunderthesea",
            likes: 13
        }
        const res = await api
          .post("/api/blogs")
          .send(newBlog)
        expect(res.status).toBe(401)
    })
})

describe("PUT /api/blogs/:id", () => {
    test("succeeds with status code 200", async () => {
        const blogs = await api.get("/api/blogs")
        const update = { likes: blogs.body[0].likes + 1 }
        const res = await api.put(`/api/blogs/${blogs.body[0].id}`).send(update)
        expect(res.status).toBe(200)
        expect(res.body.likes).toEqual(update.likes)
    })

    test("fails with status code 400 when id is bad", async () => {
        const update = { likes: 1 }
        const res = await api.put("/api/blogs/badID").send(update)
        expect(res.status).toBe(400)
    })
})

describe("DELETE /api/blogs/:id", () => {
    test("succeeds with status code 204 when id exists", async () => {
        const newBlog = {
            title: "Living under the sea",
            author: "Spongebob Squarepants",
            url: "https://www.bikinibottom.se/blogs/livingunderthesea",
            likes: 13
        }
        const user = await api.post("/api/login").send({
            username: initUser.username,
            password: initUser.password
        })
        const res = await api
          .post("/api/blogs")
          .send(newBlog)
          .set("Authorization", `Bearer ${user.body.token}`)
        expect(res.status).toBe(201)

        const idToDelete = res.body.id
        const delRes = await api
          .delete(`/api/blogs/${idToDelete}`)
          .set("Authorization", `Bearer ${user.body.token}`)
        expect(delRes.status).toBe(204)
        const blogsAfter = await api.get("/api/blogs")
        expect(blogsAfter.body).toHaveLength(initBlogs.length)
    })

    test("fails with status code 400 when id is malformed", async () => {
        const user = await api.post("/api/login").send({
            username: initUser.username,
            password: initUser.password
        })
        const res = await api
          .delete("/api/blogs/badID")
          .set("Authorization", `Bearer ${user.body.token}`)
        expect(res.status).toBe(400)
    })

    test("succeeds without changes to database when id doesn't exist", async () => {
        const user = await api.post("/api/login").send({
            username: initUser.username,
            password: initUser.password
        })
        const blogs = await api.get("/api/blogs")
        const res = await api
          .delete("/api/blogs/5a422a851b54a676234d17f7")
          .set("Authorization", `Bearer ${user.body.token}`)
        expect(res.status).toBe(204)
        const blogsAfter = await api.get("/api/blogs")
        expect(blogsAfter.body).toEqual(blogs.body)
    })
})

afterAll(async () => {
    mongoose.connection.close()
})
