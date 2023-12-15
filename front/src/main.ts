const welcome = document.getElementById("welcome")!
const signOut = document.getElementById("logout")!
const sameClassUserList = document.getElementById("same-class-user-list")!
const profileImage = document.getElementById("profile-image") as HTMLImageElement
const menu = document.getElementById("menu")!
const menuBox = document.getElementById("menu-box")!
const blind = document.getElementById("blind")!
const openMyRollingPaper = document.getElementById("open-my-rolling-paper")!

const profileSettingBtn = document.getElementById("profile-setting-btn")!
const profileSettingContainer = document.getElementById("profile-setting-container")!
const profileSettingBack = document.getElementById("profile-setting-back")!
const myProfileImage = document.getElementById("my-profile-image") as HTMLImageElement
const imageOptions = document.getElementById("image-options")!

const mySky = document.getElementById("my-sky")!
const MyRollingPaperContainer = document.getElementById("my-rolling-paper-container")!
const myRp = document.getElementById("my-rp")!
const letter = document.getElementById("letter")!
const letterTitle = document.getElementById("letter-title")!
const letterDescription = document.getElementById("letter-description")!
const closeLetter = document.getElementById("close")!
const currentPage = document.getElementById("current-page")!
const next = document.getElementById("next")!
const prior = document.getElementById("prior")!
const back = document.getElementById("back")!

const searchInput = document.getElementById("search-input") as HTMLInputElement
const searchContainer = document.getElementById("search-container")!
const userList = document.getElementById("search-user-list")!

const userSky = document.getElementById("user-sky")!
const userRpContainer = document.getElementById("user-rp-container")!
const userBack = document.getElementById("user-back")!
const userRp = document.getElementById("user-rp")!
const rpOwner = document.getElementById("rolling-paper-owner")!
const userCurrentPage = document.getElementById("user-current-page")!
const userNext = document.getElementById("user-next")!
const userPrior = document.getElementById("user-prior")!

const writeBack = document.getElementById("write-back")!
const writeBtnContainer = document.getElementById("write-btn-container")!
const writeContainer = document.getElementById("write-container")!

const paperTitle = document.getElementById("paper-title") as HTMLInputElement
const paperDescription = document.getElementById("paper-description") as HTMLInputElement
const paperWriterName = document.getElementById("writer-name") as HTMLInputElement
const rollingPaperSubmit = document.getElementById("rolling-paper-submit")!

let isOpen: boolean = false
let isLetterOpen: boolean = false

let remainingDate: number

function splitIntoChunk(arr: Array<any>, chunk: number) {
    const result = []
    for (let index=0; index < arr.length; index += chunk) {
        let tempArray
        tempArray = arr.slice(index, index + chunk)
        result.push(tempArray)
    }
    return result
}


const color = ["green", "red", "blue"]
interface sendingUserData {
    uid: number
    nickName: string
    isTeacher: boolean
    grade: number
    group: number
    classId: number
    profileImage: number
    writtenUser?: string
    theme: number
}
interface rollingPaper {
    title: string, 
    description?: string, 
    author?: string
}

fetch("/verfity-date", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
}).then(res => res.json()).then((res) => {
    if(res.msg) {
        isOpen = res.msg
        remainingDate = res.remainingDate
    }
})

let mySession: sendingUserData
fetch("/get-session", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
}).then(res => res.json()).then(async (res) => {
    const session = res.session
    mySession = await session
    welcome.innerText += `${mySession.grade}-${mySession.group} ${mySession.nickName}님 반가워요!`
    profileImage.src = `/texture/profile/${mySession.profileImage}.png`
    myProfileImage.src = `/texture/profile/${mySession.profileImage}.png`
    for(let i = 0; i < 11; i++) {
        const img = document.createElement("img") as HTMLImageElement
        img.src = `/texture/profile/${i}.png`
        img.classList.add("option-images")
        if(mySession.profileImage !== i) {
            imageOptions.append(img)
        }
        img.addEventListener("click", () => {
            fetch("/change-profile-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({imgNumber: i})
            }).then(res => res.json()).then((res) => {
                if(res.msg === "succeed") {
                    mySession.profileImage = i
                    profileImage.src = `/texture/profile/${mySession.profileImage}.png`
                    myProfileImage.src = `/texture/profile/${mySession.profileImage}.png`
                }
            })
        })
    }
    fetch("/get-same-class-user-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then((res) => {
        (res.data).forEach((data: sendingUserData) => {
            if(data.uid !== mySession.uid) {
                const box = document.createElement("div") as HTMLElement
                const profileImage = document.createElement("img") as HTMLImageElement
                const name = document.createElement("div") as HTMLElement
                box.classList.add("same-class-user")
                profileImage.classList.add("same-class-user-image")
                profileImage.src = `/texture/profile/${data.profileImage}.png`
                name.innerText = data.nickName
                if(data.isTeacher) {
                    box.style.backgroundColor = "#4F59D6"
                }
                box.append(profileImage)
                box.append(name)
                sameClassUserList.append(box) 
            }
        })
    })
})
for(let i = 0; i < 100; i++) {
    const height = MyRollingPaperContainer.getBoundingClientRect().height
    const width = MyRollingPaperContainer.getBoundingClientRect().width
    const randomHeight = Math.floor(Math.random() * height)
    const randomWidth = Math.floor(Math.random() * width)
    const star = document.createElement("div")!
    star.classList.add("star")
    star.style.top = `${randomHeight}px`
    star.style.left = `${randomWidth}px`
    mySky.append(star)
}
for(let i = 0; i < 100; i++) {
    const height = userRpContainer.getBoundingClientRect().height
    const width = userRpContainer.getBoundingClientRect().width
    const randomHeight = Math.floor(Math.random() * height)
    const randomWidth = Math.floor(Math.random() * width)
    const star = document.createElement("div")!
    star.classList.add("star")
    star.style.top = `${randomHeight}px`
    star.style.left = `${randomWidth}px`
    userSky.append(star)
}
class MyRollingPaper {
    static page: number = 0
    static maxPage: number = 0
    static async update() {
        myRp.replaceChildren()
        const userRollingPaper: Array<rollingPaper> = await getUserRp(mySession.uid)
        const sliceUserRollingPaper = splitIntoChunk(userRollingPaper, 6)
        MyRollingPaper.maxPage = sliceUserRollingPaper.length - 1
        currentPage.innerText = `${MyRollingPaper.page + 1}/${MyRollingPaper.maxPage + 1}`
        sliceUserRollingPaper[MyRollingPaper.page].forEach((element: rollingPaper, index) => {
            const starContainer = document.createElement("div")!
            const title = document.createElement("div")!
            const star = document.createElement("img") as HTMLImageElement
            star.src = "/texture/star.webp"
            title.innerText = `${element.title}`
            star.classList.add("paper")
            title.classList.add("rp-title")
            starContainer.classList.add("paper-container")
            starContainer.classList.add(`star${index+1}`)
            star.addEventListener("click", () => {
                if(isOpen) {
                    isLetterOpen = true
                    letterTitle.innerText = `${element.title}`
                    letterDescription.innerText = `${element.description}`
                    letter.classList.remove("fade-out")
                    letter.classList.add("fade-in")
                    setTimeout(() => {
                        letter.classList.remove("hidden")
                    }, 401)
                } else {
                    alert("12월 29일 00:00에 확인 가능합니다!")
                }
            })
            starContainer.append(star, title)
            myRp.append(starContainer)
        })
    }
    static next() {
        if(MyRollingPaper.page < MyRollingPaper.maxPage) {
            MyRollingPaper.page += 1
            MyRollingPaper.update()
        }
    }
    static prior() {
        if(MyRollingPaper.page > 0) {
            MyRollingPaper.page -= 1
            MyRollingPaper.update()
        }
    }
}
class UserRollingPaper {
    static uid: number
    static page: number = 0
    static maxPage: number = 0
    static async update() {
        userRp.replaceChildren()
        const userRollingPaper: Array<rollingPaper> = await getUserRp(UserRollingPaper.uid)
        const sliceUserRollingPaper = splitIntoChunk(userRollingPaper, 6)
        UserRollingPaper.maxPage = sliceUserRollingPaper.length - 1
        userCurrentPage.innerText = `${UserRollingPaper.page + 1}/${UserRollingPaper.maxPage + 1}`
        sliceUserRollingPaper[UserRollingPaper.page].forEach((element: rollingPaper, index) => {
            const starContainer = document.createElement("div")!
            const title = document.createElement("div")!
            const star = document.createElement("img") as HTMLImageElement
            star.src = "/texture/star.webp"
            title.innerText = `${element.title}`
            star.classList.add("paper")
            title.classList.add("rp-title")
            starContainer.classList.add("paper-container")
            starContainer.classList.add(`star${index+1}`)
            starContainer.append(star, title)
            userRp.append(starContainer)
        })
    }
    static next() {
        if(UserRollingPaper.page < UserRollingPaper.maxPage) {
            UserRollingPaper.page += 1
            UserRollingPaper.update()
        }
    }
    static prior() {
        if(UserRollingPaper.page > 0) {
            UserRollingPaper.page -= 1
            UserRollingPaper.update()
        }
    }
    static select(uid?: number) {
        UserRollingPaper.page = 0
        if(uid) {
            this.uid = uid
        }
        this.update()
    }
}
const getUserRp = async (uid: number) => {
    let rp
    await fetch("/get-user-rp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({uid})
    }).then(res => res.json()).then((res: {rollingPaper: Array<rollingPaper>}) => {
        if(res) {
            rp =  res.rollingPaper
        }
    })
    return rp!
}
menu.addEventListener("click", () => {
    blind.style.visibility = "visible"
    blind.style.opacity = "0.5"
    menuBox.classList.remove("hidden-right")
})
blind.addEventListener("click", () => {
    blind.style.opacity = "0"
    menuBox.classList.add("hidden-right")
    setTimeout(() => {
        blind.style.visibility = "hidden"
    },200)
})
profileSettingBtn.addEventListener("click", () => {
    profileSettingContainer.classList.remove("hidden-bottom")
})
profileSettingBack.addEventListener("click", () => {
    profileSettingContainer.classList.add("hidden-bottom")
})
signOut.addEventListener("click", () => {
    fetch("/sign-out", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then((res) => {
        if(res.msg === "succeed") {
            location.reload()
        }
    })
})
openMyRollingPaper.addEventListener("click", async () => {
    MyRollingPaper.update()
    MyRollingPaperContainer.classList.remove("hidden-right")
})
back.addEventListener("click", () => {
    MyRollingPaperContainer.classList.add("hidden-right")
    letter.classList.add("hidden")
})
closeLetter.addEventListener("click", () => {
    if(isLetterOpen) {
        letter.classList.remove("fade-in")
        letter.classList.add("fade-out")
        setTimeout(() => {
            letter.classList.add("hidden")
            isLetterOpen = false
        }, 401)
    }
})
next.addEventListener("click", () => {
    MyRollingPaper.next()
})
prior.addEventListener("click", () => {
    MyRollingPaper.prior()
})
userNext.addEventListener("click", () => {
    UserRollingPaper.next()
})
userPrior.addEventListener("click", () => {
    UserRollingPaper.prior()
})
searchInput.addEventListener("focusin", () => {
    searchContainer.classList.remove("hidden")
})
searchInput.addEventListener("focusout", () => {
    if(searchInput.value === "") {
        searchContainer.classList.add("hidden")
    }
})
searchInput.addEventListener("input", () => {
    const data = {search: searchInput.value}
    fetch("/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then((res) => {
        writeBtnContainer.replaceChildren()
        userList.replaceChildren()
        const userData = res.data
        if(userData) {
            userData.forEach((value: sendingUserData) => {
                const userContainer = document.createElement("div")!
                const nickName = document.createElement("div")!
                const profileImage = document.createElement("img") as HTMLImageElement
                const writeRollingPaper = document.createElement("div")!
                const writeBtn = document.createElement("div")!
                userContainer.classList.add("search-user-container")
                profileImage.classList.add("search-user-image")
                writeRollingPaper.classList.add("write-rolling-paper")
                writeBtn.classList.add("write-btn")
                profileImage.src = `/texture/profile/${value.profileImage}.png`
                nickName.innerText = `${value.nickName}`
                writeBtn.innerText = "롤링페이퍼 써주기!"
                writeRollingPaper.addEventListener("click", async () => {
                    userRp.replaceChildren()
                    UserRollingPaper.select(value.uid)
                    rpOwner.innerText = `${value.nickName}님의 롤링페이퍼`
                    userRpContainer.classList.remove("hidden-right")
                })
                writeBtn.addEventListener("click", () => {
                    writeContainer.classList.remove("hidden-left")
                })
                let isWritten = false
                JSON.parse(mySession.writtenUser!).forEach((data: number) => {
                    if(value.uid === data) {
                        isWritten = true
                    }
                })
                if(isWritten) {
                    writeRollingPaper.innerHTML = `<span class="material-symbols-outlined">edit</span>`
                } else {
                    writeRollingPaper.innerHTML = `<span class="material-symbols-outlined">add</span>`
                }
                userContainer.append(profileImage)
                userContainer.append(nickName)
                userContainer.append(writeRollingPaper)
                userList.append(userContainer)
                writeBtnContainer.append(writeBtn)
            })
        }
    })
})
userBack.addEventListener("click", () => {
    userRpContainer.classList.add("hidden-right")
})
writeBack.addEventListener("click", () => {
    writeContainer.classList.add("hidden-left")
})
rollingPaperSubmit.addEventListener("click", () => {
    const data = {
        paperTitle: paperTitle.value, 
        paperDescription: paperDescription.value, 
        author: paperWriterName.value,
        rpOwnerUid: UserRollingPaper.uid
    }
    fetch("/post-paper", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(async (res) => {
        if(res.msg = "succeed") {
            UserRollingPaper.update()
            alert("롤링페이퍼가 전달 됐습니다!")
            writeContainer.classList.add("hidden-left")
        }
    })
})

