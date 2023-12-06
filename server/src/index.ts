import express from "express"
import session from "express-session"
import * as mysql from "mysql"
import path from "node:path"
import { password } from "../securety/config.json"
const server = express()

const db = mysql.createConnection({ // 참조: https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
    host: "localhost",
    user: "root",
    password: password,
    database: "rollingUserAccount"
})

db.connect()

server.use(session({
    secret: 'a;/sadklnfvlfoje',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

interface userData {
    uid: number
    password: string
    nickName: string
    isTeacher: boolean
    grade: number
    group: number
    classId: number
    profileImage: number
    writtenUser: Array<number>
}
interface sendingUserData {
    uid: number
    nickName: string
    isTeacher: boolean
    grade: number
    group: number
    classId: number
    profileImage: number
}

declare module 'express-session' {
    interface SessionData {
        uid: number
        password: string
        nickName: string
        isTeacher: boolean
        grade: number
        group: number
        classId: number
        profileImage: number
        writtenUser: Array<number>
    }
}

server.use(express.urlencoded({ extended: false, limit:"5mb" }), express.json({ limit:"5mb" }))

server.get("/", (req, res) => {
    if(req.session.uid) {
        res.redirect("/home")
    } else {
        res.sendFile(path.join(__dirname, "../../front/public/html/index.html"))
    }
   
})

server.get("/home", (req, res) => {
    if(req.session.uid) {
        res.sendFile(path.join(__dirname, "../../front/public/html/home.html"))
    } else {
        res.redirect("/")
    }
})

server.post("/sign-in", (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    db.query("SELECT * FROM topic WHERE nickName=?;", [userName], (err, result) => {
        if(err) {
            throw err
        }
        if(result.length === 1) {
            const account = result[0]
            if(account.password === password) {
                req.session.uid = account.uid
                req.session.nickName = account.nickName
                req.session.isTeacher = account.isTeacher
                req.session.grade = account.grade
                req.session.group = account.classGroup
                req.session.classId = account.classId
                req.session.profileImage = account.profileImage
                req.session.writtenUser = account.writtenUser
                res.json({msg: "succeed"})
            }
        }
    })
    // db.query("INSERT INTO topic(password, nickName, isTeacher, grade, classGroup, classId, writtenUser) VALUE(?, ?, ?, ?, ?, ?, ?);", [password, userName, false, ])
    
})

server.post("/sign-out", (req, res) => {
    if(req.session.uid) {
        req.session.destroy((err) => {
            if (err) throw err
            res.json({msg: "succeed"})
        })
    }
})

server.post("/get-session", (req, res) => {
    const session = {
        uid: req.session.uid,
        nickName: req.session.nickName,
        isTeacher: req.session.isTeacher,
        grade: req.session.grade,
        group: req.session.group,
        classId: req.session.classId,
        profileImage: req.session.profileImage,
        writtenUser: req.session.writtenUser
    }
    res.json({session})
})

server.post("/get-same-class-user-data", (req, res) => {
    db.query("SELECT * FROM topic WHERE grade=? AND classGroup=?;", [req.session.grade, req.session.group], (err, result) => {
        if(err) throw err
        const data: Array<sendingUserData> = []
        result.forEach((value: userData) =>{
            data.push({
                uid: value.uid,
                nickName: value.nickName,
                isTeacher: value.isTeacher,
                grade: value.grade,
                group: value.group,
                classId: value.classId,
                profileImage: value.profileImage
            })
        })
        res.json({data})
    })
})

server.use(express.static(`${__dirname}/../../front/public`))

server.listen(80, () => {
    console.log("불빡")
})