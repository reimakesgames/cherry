const LOGIN_BUTTON = document.getElementById("login-button")

LOGIN_BUTTON.addEventListener("click", async () => {
	// window.location.href = `https://discord.com/oauth2/authorize?client_id=1266028997381193738&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fredirect&scope=identify`
	window.location.href = `https://discord.com/oauth2/authorize?client_id=1266028997381193738&response_type=code&redirect_uri=https%3A%2F%2Fcherry.reicaffie.com%2Fapi%2Fauth%2Fredirect&scope=identify`
})
