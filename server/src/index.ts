import express from "express"
import session from "express-session"
import * as mysql from "mysql"
import path from "node:path"
import { password } from "../config/config.json"
import { code } from "../config/teacherCode.json"
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
    profileImage: number
    writtenUser: string
    rollingPaper: string
    theme: number
}
interface sendingUserData {
    uid: number
    nickName: string
    isTeacher: boolean
    grade: number
    group: number
    profileImage: number
    writtenUser: string
    rollingPaper?: string
    theme: number
}

declare module 'express-session' {
    interface SessionData {
        uid: number
        password: string
        nickName: string
        isTeacher: boolean
        grade: number
        group: number
        profileImage: number
        writtenUser: string
        rollingPaper: string
        theme: number
    }
}

const pattern = /\s/g

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
                req.session.profileImage = account.profileImage
                req.session.writtenUser = account.writtenUser
                req.session.theme = account.theme
                res.json({msg: "succeed"})
            } else {
                res.json({msg: "wrongPassword"})
            }
        } else {
            res.json({msg: "noExist"})
        }
    })
})
server.post("/sign-up", (req, res) => {
    const teacherCode = req.body.teacherCode
    const grade = req.body.grade
    const group = req.body.group
    const userName = req.body.userName
    const password = req.body.password
    let isTeacher = false
    if(teacherCode === code) {
        isTeacher = true
    }
    db.query("SELECT * FROM topic WHERE nickName=?;", [userName], (err, result) => {
        if(err) {
            throw err
        }
        if(result.length === 0) {
            if(!userName.match(pattern) && !password.match(pattern)) {
                if((userName.length <= 8 && password.length <= 20)) {
                    db.query("INSERT INTO topic(password, nickName, isTeacher, grade, classGroup, writtenUser, profileImage, rollingPaper) VALUE(?, ?, ?, ?, ?, ?, ?, ?);", [password, userName, isTeacher, grade, group, '[]', 10, '[]'], (err, _result) => {
                        if(err) throw err
                        res.json({msg: "succeed"})
                    })
                } else {
                    res.json({msg: "overCharLimit"})
                }
            } else {
                res.json({msg: "spaceChar"})
            }
            
        } else {
            res.json({msg: "alreadyExist"})
        }
    })
    
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
    const session: sendingUserData = {
        uid: req.session.uid!,
        nickName: req.session.nickName!,
        isTeacher: req.session.isTeacher!,
        grade: req.session.grade!,
        group: req.session.group!,
        profileImage: req.session.profileImage!,
        writtenUser: req.session.writtenUser!,
        rollingPaper: req.session.rollingPaper!,
        theme: req.session.theme!
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
                profileImage: value.profileImage,
                writtenUser: value.writtenUser,
                theme: value.theme
            })
        })
        res.json({data})
    })
})

server.post("/search", (req, res) => {
    const searchText = req.body.search
    const regExp1 = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    if(!regExp1.test(searchText)) {
        if(searchText.length > 0) {
            db.query("SELECT * FROM topic WHERE nickName LIKE ?", [`%${searchText}%`], (err, result) => {
                if(err) throw err
                const data: Array<sendingUserData> = []
                result.forEach((value: userData) =>{
                    data.push({
                        uid: value.uid,
                        nickName: value.nickName,
                        isTeacher: value.isTeacher,
                        grade: value.grade,
                        group: value.group,
                        profileImage: value.profileImage,
                        writtenUser: value.writtenUser,
                        theme: value.theme
                    })
                })
                res.json({data})
            })
        } else {
            res.json({})
        }
    } else {
        res.json({})
    }
})

server.use(express.static(`${__dirname}/../../front/public`))

server.listen(80, () => {
    console.log("불빡")
})