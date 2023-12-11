const welcome = document.getElementById("welcome")!
const signOut = document.getElementById("logout")!
const sameClassUserList = document.getElementById("same-class-user-list")!
const profileImage = document.getElementById("profile-image") as HTMLImageElement
const openMyrollingPaper = document.getElementById("open-my-rolling-paper")!

const mySky = document.getElementById("my-sky")!
const myRollingPaperContainer = document.getElementById("my-rolling-paper-container")!
const back = document.getElementById("back")!

const searchInput = document.getElementById("search-input") as HTMLInputElement
const searchContainer = document.getElementById("search-container")!
const userList = document.getElementById("search-user-list")!

const userSky = document.getElementById("user-sky")!
const postContainer = document.getElementById("post-container")!
const postBack = document.getElementById("post-back")!
const rpOwner = document.getElementById("rolling-paper-owner")!

const writeBack = document.getElementById("write-back")!
const writeBtnContainer = document.getElementById("write-btn-container")!
const writeContainer = document.getElementById("write-container")!

const paperTitle = document.getElementById("paper-title") as HTMLInputElement
const paperDescription = document.getElementById("paper-description") as HTMLInputElement
const paperWriterName = document.getElementById("writer-name") as HTMLInputElement
const rollingPaperSubmit = document.getElementById("rolling-paper-submit")!

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
for(let i = 0; i < 100; i++) {
    const height = myRollingPaperContainer.getBoundingClientRect().height
    const width = myRollingPaperContainer.getBoundingClientRect().width
    const randomHeight = Math.floor(Math.random() * height)
    const randomWidth = Math.floor(Math.random() * width)
    const star = document.createElement("div")!
    star.classList.add("star")
    star.style.top = `${randomHeight}px`
    star.style.left = `${randomWidth}px`
    mySky.append(star)
}
for(let i = 0; i < 100; i++) {
    const height = postContainer.getBoundingClientRect().height
    const width = postContainer.getBoundingClientRect().width
    const randomHeight = Math.floor(Math.random() * height)
    const randomWidth = Math.floor(Math.random() * width)
    const star = document.createElement("div")!
    star.classList.add("star")
    star.style.top = `${randomHeight}px`
    star.style.left = `${randomWidth}px`
    userSky.append(star)
}
let userSession: sendingUserData
fetch("/get-session", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
}).then(res => res.json()).then((res) => {
    const session = res.session
    userSession = session
    welcome.innerText += `${userSession.grade}-${userSession.group} ${userSession.nickName}님 반가워요!`
    profileImage.src = `/texture/profile/${userSession.profileImage}.png`
    fetch("/get-same-class-user-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then((res) => {
        (res.data).forEach((data: sendingUserData) => {
            if(data.uid !== userSession.uid) {
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
            
        });
    })
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
openMyrollingPaper.addEventListener("click", () => {
    myRollingPaperContainer.classList.remove("hidden-right")
})
back.addEventListener("click", () => {
    myRollingPaperContainer.classList.add("hidden-right")
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
        userList.replaceChildren()
        writeBtnContainer.replaceChildren()
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
                writeRollingPaper.addEventListener("click", () => {
                    rpOwner.innerText = `${value.nickName}님의 `
                    postContainer.classList.remove("hidden-right")
                })
                writeBtn.addEventListener("click", () => {
                    writeContainer.classList.remove("hidden-left")
                })
                let isWritten = false
                JSON.parse(userSession.writtenUser!).forEach((data: number) => {
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
postBack.addEventListener("click", () => {
    postContainer.classList.add("hidden-right")
})
writeBack.addEventListener("click", () => {
    writeContainer.classList.add("hidden-left")
})
rollingPaperSubmit.addEventListener("click", () => {
    const data = {
        paperTitle: paperTitle.value, 
        paperDescription: paperDescription.value, 
        paperWriterName: paperWriterName.value
    }
    fetch("post-paper", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
})