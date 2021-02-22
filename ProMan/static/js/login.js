import {dataHandler, easyHandler} from "./data_handler.js";

const forms = document.querySelectorAll('.needs-validation');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const emailMessage = document.querySelector('.email-message');
const passwordMessage = document.querySelector('.password-message');
emailMessage.style.fontSize = '10px'
passwordMessage.style.fontSize = '10px'

Array.prototype.slice.call(forms).forEach((form) => {
	form.addEventListener('submit', (event) => {
		if (!form.checkValidity()) {
			event.preventDefault();
			event.stopPropagation();
		}

		validateUser()

		form.classList.add('was-validated');

	}, false);
})

function checkEmailInput() {
	if (emailInput.value === '') {
		emailMessage.innerText = 'filed cant be blank'
	}

	if (!emailInput.value.includes('@')) {
		emailMessage.innerText = 'not valid email address'

	}
}

function checkPasswordInput() {
	if (passwordInput.value === '') {
		passwordMessage.innerText = 'wrong password'

	}
}

function validateUser() {

	if (!checkEmailInput() && !checkPasswordInput()) {

		easyHandler.postJson('/check-user', {'email': emailInput.innerText, 'password': passwordInput.innerText}, (response) => {
			console.log(response)
			if (response === true) {
				document.location.href = "/";
			}

		})

	}


}


// const data = easyHandler._getData('/check', (json_data) => console.log(json_data.email))






