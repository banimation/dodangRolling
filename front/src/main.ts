const welcome = document.getElementById("welcome") as HTMLElement
const signOut = document.getElementById("logout") as HTMLElement
const sameClassUserList = document.getElementById("same-class-user-list") as HTMLElement
const profileImage = document.getElementById("profile-image") as HTMLImageElement
const openMyrollingPaper = document.getElementById("open-my-rolling-paper") as HTMLElement
const myRollingPaperContainer = document.getElementById("my-rolling-paper-container") as HTMLElement
const back = document.getElementById("back") as HTMLElement
const searchInput = document.getElementById("search-input") as HTMLInputElement
const searchContainer = document.getElementById("search-container") as HTMLElement
const userList = document.getElementById("search-user-list") as HTMLElement

interface sendingUserData {
    uid: number
    nickName: string
    isTeacher: boolean
    grade: number
    group: number
    classId: number
    profileImage: number
    writtenUser?: string
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
    searchContainer.classList.add("hidden")
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
        const userData = res.data
        if(userData) {
            userData.forEach((value: sendingUserData) => {
                const userContainer = document.createElement("div") as HTMLElement
                const nickName = document.createElement("div") as HTMLElement
                const profileImage = document.createElement("img") as HTMLImageElement
                const writeRollingPaper = document.createElement("div") as HTMLElement
                userContainer.classList.add("search-user-container")
                profileImage.classList.add("search-user-image")
                writeRollingPaper.classList.add("write-rolling-paper")
                profileImage.src = `/texture/profile/${value.profileImage}.png`
                nickName.innerText = `${value.nickName}`
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
            })
        }
    })
})