const body = document.body as HTMLBodyElement
const title = document.getElementById("title") as HTMLElement
const signInContainer = document.getElementById("sign-in-container") as HTMLElement
const userNameInput = (document.getElementById("username-input") as HTMLInputElement)
const passwordInput = (document.getElementById("password-input") as HTMLInputElement)
const signIn = document.getElementById("sign-in") as HTMLElement

title.addEventListener("click", () => {
    title.classList.add("fade-out")
    setTimeout(() => {
        title.classList.add("hidden")
        signInContainer.classList.remove("hidden")
        signInContainer.classList.add("fade-in")
    }, 501)
})
signIn.addEventListener("click", () => {
    const data = {userName: userNameInput.value, password: passwordInput.value}
    fetch("/sign-in", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then((res) => {
        if(res.msg === "succeed") {
            location.reload()
        }
    })
})