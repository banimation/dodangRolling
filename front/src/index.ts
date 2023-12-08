const body = document.body as HTMLBodyElement
const title = document.getElementById("title") as HTMLElement

const signOption = document.getElementById("sign-option") as HTMLElement
const signUpOption = document.getElementById("sign-up-option") as HTMLElement
const signInOption = document.getElementById("sign-in-option") as HTMLElement

const signUpContainer = document.getElementById("sign-up-container") as HTMLElement
const signInContainer = document.getElementById("sign-in-container") as HTMLElement

const signInUserNameInput = (document.getElementById("sign-in-username-input") as HTMLInputElement)
const signInPasswordInput = (document.getElementById("sign-in-password-input") as HTMLInputElement)
const signIn = document.getElementById("sign-in") as HTMLElement

const grade = document.getElementById("grade") as HTMLInputElement
const showGrade = document.getElementById("show-grade") as HTMLElement
const group = document.getElementById("group") as HTMLInputElement
const showGroup = document.getElementById("show-group") as HTMLElement

const checkBox = document.getElementById("checkbox-input") as HTMLInputElement
const teacherCodeContainer = document.getElementById("teacher-code-container") as HTMLInputElement
const teacherCode = document.getElementById("teacher-code-input") as HTMLInputElement

const signUpUserNameInput = (document.getElementById("sign-up-username-input") as HTMLInputElement)
const signUpPasswordInput = (document.getElementById("sign-up-password-input") as HTMLInputElement)
const signUp = document.getElementById("sign-up") as HTMLElement

title.addEventListener("click", () => {
    title.classList.add("fade-out")
    setTimeout(() => {
        title.classList.add("hidden")
        signOption.classList.remove("hidden")
        signOption.classList.add("fade-in")
    }, 501)
})
signInOption.addEventListener("click", () => {
    signOption.classList.add("fade-out")
    setTimeout(() => {
        signOption.classList.add("hidden")
        signInContainer.classList.remove("hidden")
        signInContainer.classList.add("fade-in")
    }, 501)
})
signUpOption.addEventListener("click", () => {
    signOption.classList.add("fade-out")
    setTimeout(() => {
        signOption.classList.add("hidden")
        signUpContainer.classList.remove("hidden")
        signUpContainer.classList.add("fade-in")
    }, 501)
})
grade.addEventListener("input", () => {
    showGrade.innerText = `${grade.value}학년`
})
group.addEventListener("input", () => {
    showGroup.innerText = `${group.value}반`
})
signIn.addEventListener("click", () => {
    const data = {userName: signInUserNameInput.value, password: signInPasswordInput.value}
    fetch("/sign-in", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then((res) => {
        if(res.msg === "succeed") {
            location.reload()
        } else if(res.msg === "wrongPassword") {
            alert("잘못된 비밀번호")
        } else if(res.msg === "noExist") {
            alert("존재하지 않는 계정 입니다.")
        }
    })
})
signUp.addEventListener("click", () => {
    const data = {teacherCode: teacherCode.value, grade: grade.value, group: group.value, userName: signUpUserNameInput.value, password: signUpPasswordInput.value}
    fetch("/sign-up", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then((res) => {
        if(res.msg === "succeed") {
            alert("계정 생성에 성공하였습니다. 로그인 하십시오.")
            signUpContainer.classList.add("fade-out")
            setTimeout(() => {
                signUpContainer.classList.add("hidden")
                signInContainer.classList.remove("hidden")
                signInContainer.classList.add("fade-in")
            }, 501)
        } else if(res.msg === "overCharLimit") {
            alert("이름은 8글자 이하, 비밀번호는 20글자 이하민 가능합니다.")
        } else if(res.msg === "spaceChar") {
            alert("사용할 수 없는 문자가 사용됐습니다.")
        }else if(res.msg === "alreadyExist") {
            alert("이름이 이미 존재합니다.")
        }
    })
})
let isTeacher = false
checkBox.addEventListener("input", () => {
    if(isTeacher) {
        teacherCodeContainer.classList.add("hidden")
        isTeacher = false
    } else {
        teacherCodeContainer.classList.remove("hidden")
        isTeacher = true
    }
})