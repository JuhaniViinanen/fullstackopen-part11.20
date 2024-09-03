const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const User = require("../models/user")

const api = supertest(app)

const initUsers = [
    {
        username: "root",
        passwordHash: "notarealhash",
        name: "RootUser"
    },
    {
        username: "squarebob313",
        passwordHash: "notarealhash",
        name: "Spongebob"
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    const users = initUsers.map(user => new User(user))
    await Promise.all( users.map(user => user.save()) )
})

describe("GET /api/users", () => {
    test("returns all the users in the right format", async () => {
        const res = await api.get("/api/users")
        expect(res.status).toBe(200)
        expect(res.headers["content-type"]).toMatch(/application\/json/)
        expect(res.body).toHaveLength(initUsers.length)
    })
})

describe("POST /api/users", () => {
    test("succeeds with 201 when request creates a user", async () => {
        const newUser = {
            username: "squidward",
            password: "tentacles",
            name: "Squidward"
        }
        const res = await api.post("/api/users").send(newUser)
        expect(res.status).toBe(201)
        expect(res.headers["content-type"]).toMatch(/application\/json/)
        expect(res.body.username).toMatch(newUser.username)
        expect(res.body.name).toMatch(newUser.name)
    })

    test("saves the new user into the database", async () => {
        const newUser = {
            username: "squidward",
            password: "tentacles",
            name: "Squidward"
        }
        const res = await api.post("/api/users").send(newUser)
        expect(res.status).toBe(201)
        const usersAfter = await api.get("/api/users")
        expect(usersAfter.body).toHaveLength(initUsers.length + 1)
        const userNames = usersAfter.body.map(user => user.username)
        expect(userNames).toContain(newUser.username)
    })

    test("fails with status code 400 if data is invalid", async () => {
        const invalidPass = {
            username: "squidward",
            password: "t",
            name: ""
        }
        const invalidUsername = {
            username: "sq",
            password: "tentacles",
            name: "Squidward"
        }
        const invalidPassRes = await api.post("/api/users").send(invalidPass)
        const invalidUsernameRes = await api.post("/api/users").send(invalidUsername)
        expect(invalidPassRes.status).toBe(400)
        expect(invalidUsernameRes.status).toBe(400)

        const usersAfter = await api.get("/api/users")
        expect(usersAfter.body).toHaveLength(initUsers.length)
    })
})

afterAll(async () => {
    mongoose.connection.close()
})
