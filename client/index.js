const LOGIN_BUTTON = document.getElementById("login-button")
const SKIP_LOGIN = document.getElementById("skip-login")

const API = window.location.origin

const LOCALHOST_OAUTH2 = `https://discord.com/oauth2/authorize?client_id=1266028997381193738&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fredirect&scope=identify`
const PROD_OAUTH2 = `https://discord.com/oauth2/authorize?client_id=1266028997381193738&response_type=code&redirect_uri=https%3A%2F%2Fcherry.reicaffie.com%2Fapi%2Fauth%2Fredirect&scope=identify`

LOGIN_BUTTON.addEventListener("click", () => {
	if (window.location.origin === "http://localhost:3000") {
		window.location.href = LOCALHOST_OAUTH2
	} else {
		window.location.href = PROD_OAUTH2
	}
})

SKIP_LOGIN.addEventListener("click", () => {
	fetch(`${API}/api/auth/skip`)
		.then(() => {
			window.location.href = "/home/"
		})
		.catch((error) => {
			console.error(error)
		})
})
