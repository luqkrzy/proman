//  In progress
// const editFields = document.querySelectorAll('a[edit="true"]')
// editCardTitleLink.addEventListener('click', changeCardName)
//
// function changeCardName() {
// 	const editCartTitleName = editCardTitleLink.getAttribute('name');
// 	const cardTitleTag = document.getElementById(editCartTitleName);
// 	cardTitleTag.innerHTML = `<input type="text" placeholder="">`
// }


document.addEventListener('dblclick', (event) => {
	const target = event.target;
	if (target.getAttribute('edit') === "true") {
		const oldValue = target.innerText
		target.innerHTML = `<input class="w-100" type="text" placeholder=${oldValue}>`;
		target.childNodes[0].focus()

		document.addEventListener('click', (secondEvent) => {

			if (secondEvent.target === target) {
				//pass
			} else {
				const newValue = target.childNodes[0].value

				if (newValue === '') {
					target.innerText = oldValue
				} else {
					target.innerHTML = `${newValue}<span class="dropdown-toggle" data-mdb-toggle="dropdown"></span>
						<div class="dropdown-menu">
							<span class="dropdown-item">Edit</span>
							<span class="dropdown-item">Delete</span>`
				}

			}

		}, {once: true})
	}
})
