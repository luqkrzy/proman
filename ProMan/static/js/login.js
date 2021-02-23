import {dataHandler, easyHandler} from "./data_handler.js";

const loginBtn = document.getElementById('login-btn')
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const emailFeedback = document.getElementById('email-feedback');
const passwordFeedback = document.getElementById('password-feedback');
emailFeedback.style.cssText = 'width: 100%; margin-top: 0.25rem; font-size: 0.675em; color: #dc3545;'
passwordFeedback.style.cssText = 'width: 100%; margin-top: 0.25rem; font-size: 0.675em; color: #dc3545;'

loginBtn.addEventListener('click', (event) => {
	event.preventDefault();
	event.stopPropagation();
	validateUser();
})

function checkEmailInput() {
	if (emailInput.value === '' || !emailInput.value.includes('@')) {
		emailFeedback.innerHTML = '&nbsp; Not a valid email';
		return false
	}

	console.log('email true', emailInput.value)
	return true
}

function checkPasswordInput() {
	if (passwordInput.value === '') {
		passwordFeedback.innerHTML = '&nbsp Wrong email or password'
		return false
	}
	console.log('password true', passwordInput.value)
	return true
}

function validateUser() {

	if (checkEmailInput() && checkPasswordInput()) {

		easyHandler.postJson('/api/login', {'email': emailInput.value, 'password': passwordInput.value}, (response) => {
			console.log(response)
			if (response === true) {
				document.location.href = "/";
			} else {
				passwordFeedback.innerHTML = '&nbsp Wrong email or password'
			}
		})
	}
}





