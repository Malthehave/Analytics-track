const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid')
const helmet = require('helmet')

const mongoConfig = require('./mongo.config')

const app = express()
const port = 3000
app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use(express.text())


// EXAMPLE OF DATABASE STORE
const userObj = []

app.get('/track', async (req, res) => {
    // Check if cookie is already present
    const { userid } = req.cookies;
    let uniqueUserId = userid
    if (!userid) {
        // Check if userid param is specified
        const useridParam = req.query.userid
        const CookieExpires = new Date;
        CookieExpires.setFullYear(CookieExpires.getFullYear() + 1); // Expire cookie in one year
        uniqueUserId = useridParam || uuidv4() // Specified id or generate qunique id
        const newCookie = `userid=${uniqueUserId}; Expires=${CookieExpires}; samesite=none;`;
        res.setHeader("set-cookie", [newCookie])
    }
    res.json("ok")


    userObj.push({
        userId: uniqueUserId,
        page: '/' + req.header('Referer').split('/').pop(),
        userAgent: req.header('User-Agent'),
        timestamp: Date.now()
    })

    // Get database client
    const client = await mongoConfig.connectToDB();
    await client.db().collection('events').insertOne({
        userId: uniqueUserId,
        page: '/' + req.header('Referer').split('/').pop(),
        userAgent: req.header('User-Agent'),
        timestamp: Date.now()
    })
})

app.post('/', (req, res) => {
    res.status(204).send("1")
    console.log(req.body)
    console.log("================================")
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))