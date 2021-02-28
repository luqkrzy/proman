function changeName() {
	document.addEventListener('dblclick', (event) => {
		const target = event.target;
		if (target.getAttribute('edit') === "true") {
			const oldValue = target.innerText;
			target.innerHTML = `<input class="w-100" type="text" placeholder=${oldValue}>`;
			target.childNodes[0].focus();
			target.removeEventListener('mouseleave', removeMenu);
			target.removeEventListener('mouseenter', createDropdownMenu);

			document.addEventListener('click', (secondEvent) => {

				if (secondEvent.target === target) {
					//pass
				} else {
					const newValue = target.childNodes[0].value;

					if (newValue === '') {
						target.innerText = oldValue;
					} else {
						target.innerHTML = `${newValue}`;
					}
				}
			}, {once: true});
		}
	})

}

function dragAndDrop() {
	const cardsBody = document.querySelectorAll('.cardBody');
	const allCards = document.querySelector('.allCards');

	cardsBody.forEach(card => {
		new Sortable(card, {
			group: 'shared', animation: 150, ghostClass: 'bg-warning'
		});
	})

	new Sortable(allCards, {
		swapThreshold: 1, animation: 150, ghostClass: 'bg-warning'
	});

}

const editFields = document.querySelectorAll('div[edit="true"]')
editFields.forEach(field => field.addEventListener('mouseenter', createDropdownMenu))

function createDropdownMenu(event) {
	const menu = `<span class="dropdown-toggle" data-mdb-toggle="dropdown" id="dropDownCardItem-1"></span>
	<div class="dropdown-menu" aria-labelledby="dropDownCardTitle-1">
		<span class="dropdown-item">Edit</span>
		<span class="dropdown-item">Delete</span>
	</div>`
	event.target.insertAdjacentHTML('beforeend', menu)

}

editFields.forEach(field => field.addEventListener('mouseleave', removeMenu))

function removeMenu(event) {
	const itemText = event.target.innerText;

	if (itemText.includes('Edit\nDelete')) {
		event.target.innerHTML = itemText.replace('Edit\nDelete', '');
	} else {
		event.target.innerHTML = itemText;
	}
}

changeName()
dragAndDrop()
