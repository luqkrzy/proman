import {dataHandler, easyHandler} from "./data_handler.js";

const userForms = document.getElementById('userForms')
const feedbackStyle = 'width: 100%; margin-top: 0.25rem; font-size: 0.675em; color: #dc3545;'
const loginBtn = document.getElementById('loginBtn')
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginEmailFeedback = document.getElementById('loginEmailFeedback');
const loginPasswordFeedback = document.getElementById('loginPasswordFeedback');
const feedbackFields = document.querySelectorAll('.feedback')
feedbackFields.forEach(field => field.style.cssText = feedbackStyle)

const registerUsername = document.getElementById('registerUsername')
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerRepeatPassword = document.getElementById('registerRepeatPassword');
const registerBtn = document.getElementById('registerBtn');
const registerEmailFeedback = document.getElementById('registerEmailFeedback');
const registerPasswordFeedback = document.getElementById('registerPasswordFeedback');

// user registration
registerBtn.addEventListener('click', (event) => {
	event.preventDefault();
	event.stopPropagation();
	registerUser()

})

registerEmail.addEventListener('change', checkEmailInDatabase)


function checkEmailInDatabase() {
	easyHandler._getData(`/api/user/${registerEmail.value}`, (response) => {
		if (response === true) {
			registerEmailFeedback.style.color = 'red'
			registerEmailFeedback.innerHTML = '&nbsp; Email already exists';
			registerBtn.classList.add('disabled');
			return true
		} else {
			registerEmailFeedback.innerHTML = '&nbsp; Email not in database';
			registerEmailFeedback.style.color = 'green';
			registerBtn.classList.remove('disabled');
			return false
		}
	})
}


function checkPasswordMatch() {
	if (registerPassword.value === registerRepeatPassword.value) {
		console.log('password OK')
		return true
	} else {
		registerPasswordFeedback.innerHTML = '&nbsp; password doesn\'t match'
		return false

	}
}

function registerUser() {
	if (checkPasswordMatch()) {
		checkEmailInDatabase();
		easyHandler.postJson('PUT', '/api/register', {'email': registerEmail.value, 'name': registerUsername.value, 'password': registerPassword.value}, (response) => {
			console.log(response);

			if (response === true) {
				userForms.innerHTML = `
		<div class="alert  text-center alert-success alert-dismissible fade show" role="alert">
			Account sucsesluly created <a href="/login" class="alert-link">long in here</a>.
			<button type="button" class="btn-close ms-2 my-0" data-mdb-dismiss="alert" aria-label="Close"></button>
		</div>
		`
			} else {
				userForms.innerHTML = `
		<div class="alert  text-center alert-danger alert-dismissible fade show" role="alert">
			Some error ocurred - please try later.
			<button type="button" class="btn-close ms-2 my-0" data-mdb-dismiss="alert" aria-label="Close"></button>
		</div>
		`
			}
		})


	}
}

// user login
loginBtn.addEventListener('click', (event) => {
	event.preventDefault();
	event.stopPropagation();
	validateUser();
})

function validateUser() {

	function checkEmailInput() {
		if (emailInput.value === '' || !emailInput.value.includes('@')) {
			loginEmailFeedback.innerHTML = '&nbsp Wrong email or password'
			return false
		}

		console.log('email true', emailInput.value)
		return true
	}

	function checkPasswordInput() {
		if (passwordInput.value === '') {
			loginPasswordFeedback.innerHTML = '&nbsp Wrong email or password'
			return false
		}
		console.log('password true', passwordInput.value)
		return true
	}

	if (checkEmailInput() && checkPasswordInput()) {
		easyHandler.postJson('POST', '/api/login', {'email': emailInput.value, 'password': passwordInput.value}, (response) => {
			console.log(response)
			if (response === true) {
				document.location.href = "/";
			} else {
				loginPasswordFeedback.innerHTML = '&nbsp Wrong email or password'
			}
		})
	}
}





