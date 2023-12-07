const welcome = document.getElementById("welcome") as HTMLElement
const signOut = document.getElementById("logout") as HTMLElement
const sameClassUserList = document.getElementById("same-class-user-list") as HTMLElement
const profileImage = document.getElementById("profile-image") as HTMLImageElement
const openMyrollingPaper = document.getElementById("open-my-rolling-paper") as HTMLElement
const myRollingPaperContainer = document.getElementById("my-rolling-paper-container") as HTMLElement
const back = document.getElementById("back") as HTMLElement
interface sendingUserData {
    uid: number
    nickName: string
    isTeacher: boolean
    grade: number
    group: number
    classId: number
    profileImage: number
    writtenUser?: Array<string>
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