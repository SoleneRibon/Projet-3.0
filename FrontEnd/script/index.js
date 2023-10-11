
//***************** Si pas connecté ********************/

const apiUrl = "http://localhost:5678/api/"
const allWorks = new Set()
const allCats = new Set()
const gallery = document.querySelector("#gallery")
const filtersDiv = document.querySelector("#filters")


async function init() {
	const worksPromise = getDatabaseData("works")
	const catsPromise = getDatabaseData("categories")
	const works = await worksPromise
	const cats = await catsPromise

	for (const work of works) {
		allWorks.add(work)
	}

	for (const cat of cats) {
		allCats.add(cat)
	}

	displayWorks()
	displayFilter()
	closeModal()
}
init()

//fetch de l'API.
async function getDatabaseData(type) {
	try {
		const responseData = await fetch(apiUrl + type);
		const allData = await responseData.json();
		return allData;
	} catch (error) {
		console.error(error);
	}
};

//génération des works.
function displayWorks(filter = "0") {
	gallery.innerHTML = ""
	let selectedWorks = allWorks
	if (filter != "0") {
		selectedWorks = [...allWorks].filter(work => work.categoryId == filter)
	}
	const fragment = document.createDocumentFragment()
	for (const work of selectedWorks) {
		const figure = document.createElement("figure");
		figure.setAttribute('categoryId', work.categoryId)
		figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"/>
							<figcaption>${work.title}</figcaption>`
		fragment.appendChild(figure)
	}
	gallery.appendChild(fragment)
}

//activations des filtres avec les boutons.
function addFiltersHandler() {
	const filtersButton = document.querySelectorAll('.filters-button');
	for (const button of filtersButton) {
		button.addEventListener('click', function (event) {
			displayFilter(event.target.dataset.id)
			displayWorks(event.target.dataset.id)
		})
	}
}

//création des boutons pour filtrer
function displayFilter(filter = '0') {
	//création bouton TOUS
	filtersDiv.innerHTML = ''
	const fragment = document.createDocumentFragment()
	const button = document.createElement('button');
	button.dataset.id = 0;
	button.innerText = 'Tous';
	button.classList.add("filters-button");
	if (filter === '0') {
		button.classList.add('active')
	}
	fragment.appendChild(button)
	// Les autres boutons
	for (const cat of allCats) {
		const catButton = document.createElement('button');
		catButton.dataset.id = cat.id;
		catButton.innerText = cat.name;
		catButton.classList.add("filters-button");
		if (filter == cat.id.toString()) {
			catButton.classList.add('active')
		}
		fragment.appendChild(catButton)
	}
	filtersDiv.appendChild(fragment)
	addFiltersHandler()
}
	


//*****************Si connecté ********************/

const editBtn = document.querySelector('.edit-btn');
const topBar = document.querySelector('.top-info');

//Récupération du Token
const userToken = sessionStorage.getItem("token");
const isLogged = userToken != null;

if (isLogged) {
	// Modification de "login" par "logout"
	const navbar = document.querySelector("nav");
	const logIn = navbar.querySelector("li:nth-child(3)");
	logIn.innerText = "logout";
	// Ajout d'un id au bouton pour le manipuler
	logIn.id = "logoutBtn";

	const logOutbtn = document.getElementById("logoutBtn");
	// Fonction qui permet d'écouter au click, de remove le token et de clear la session
	logOutbtn.addEventListener("click", () => {
		//Clear de la session
		sessionStorage.clear();
		// Redirection sur la page login.html
		window.location.replace("./index.html")
	});
	//Récupération des filtres
	const filters = document.querySelector(".filters");
	//Disparition des filtres
	filters.style.display = "none";
	//apparition de la barre mode edit + Bouton modale
	topBar.style.display = null;
	editBtn.style.display = null;
}
else {
	topBar.style.display = "none";
	editBtn.style.display = "none";
}	



/**************************************
 **************************************
 **************************************
			Modale fct
	
***************************************
***************************************
**************************************/

const modaleBack = document.getElementById('modale');
const divModale = document.querySelector('.modaleBox');
const figureModale = document.querySelector('.figure-img');
const crossModale = document.querySelector('.cross-modale');
const crossModaleImg = document.querySelector('.cross-modaleImg');
const btnAddImg = document.querySelector('.addImg');
const AddImgPage = document.querySelector('.addImgModale');
const arrowModal = document.querySelector('.arrow-modale');

//fonction pour montrer les projets dans la modale
function displayWorksIntoModal() {
	figureModale.innerHTML = ''
	const fragment = document.createDocumentFragment()
	for (const work of allWorks) {
		const figure = document.createElement("figure");
		figure.classList.add('figureWorksModal');
		figure.setAttribute('data-id', work.id)
		figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"/> 
		<div class="trash">
		<i class="btnTrash fa-solid fa-trash-can"></i>
		</div>`

		fragment.appendChild(figure)
	}
	figureModale.appendChild(fragment)
	deleteWork();
}

//montrer la modale
function displayModale() {
	modaleBack.style.display = null;
	divModale.style.display = null;
	modaleBack.classList.remove('modaleDisable');
	modaleBack.classList.add('modale')

	crossModale.addEventListener('click', closeModal);
	displayWorksIntoModal();
}

//fermer la modale
function closeModal() {
	divModale.style.display = "none";
	AddImgPage.style.display = "none";
	modaleBack.style.display = "none";
	modaleBack.setAttribute('aria-hidden', 'true');
	formAddWork.reset()
	document.querySelector('#previewImage').src = "#"
	document.querySelector('.addImgContainer').classList.remove('hide')
	document.querySelector('.btnSubmit').classList.remove('btnColor')
}
modaleBack.addEventListener('click', function (event) {
	if (event.target === modaleBack) {
		closeModal();
	}
});


// Récupération du bouton et ajout du listener pour montrer la modale
editBtn.addEventListener('click', () => {
	displayModale();
});


// Function pour récupérer le projet en fonction de son ID
function findWorkById(id) {
	for (const work of allWorks) {
		if (work.id === id) {
			return work;
		}
	}
}


// Suppression des travaux
async function deleteProject(worksId) {
	const apiUrlWorks = "http://localhost:5678/api/works";
	const deleteUrl = `${apiUrlWorks}/${worksId}`;
	console.log(deleteUrl)

	if (confirm) {
		const response = await fetch(deleteUrl, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${userToken}`,
			}
		});
		if (!response.ok) {
			throw new Error('Une erreur a eu lieu pendant la suppression du projet');
		} else {
			const workstoRemove = document.querySelector(`.figureWorksModal[data-id="${worksId}"]`);
			if (workstoRemove) {
				workstoRemove.remove();
				alert('Suppression du projet avec succès');
				// Actualisation de la gallerie des projets
				const workToRemove = findWorkById(parseInt(worksId));

				if (workToRemove) {
					allWorks.delete(workToRemove);
					displayWorks();
				}
			} else {
				console.log('Élément introuvable')
			}
		}
	}
}
		

// Supression du Work sélectionné
function deleteWork() {
	const btnDelete = document.querySelectorAll(".btnTrash");
	if (btnDelete) {
		for (const button of btnDelete) {
			button.addEventListener("click", () => {
				const worksId = button.closest('.figureWorksModal').dataset.id;
				deleteProject(worksId);
			})
		}
	}
}


//Lancement seconde page Modale (Ajout Photo)
btnAddImg.addEventListener('click', () => {
	AddImgPage.style.display = 'flex';
	// Cacher la première page
	const firstPageModal = document.querySelector('.modaleBox');
	firstPageModal.style.display = 'none';

	// Toggle firstPageModal & addImgModal
	arrowModal.addEventListener('click', (event) => {
		if (event.target === arrowModal) {
			AddImgPage.style.display = 'none';
			firstPageModal.style.display = 'flex';
		}
	})
	// Fermeture modale et remise à zéro
	crossModaleImg.addEventListener('click', closeModal);
	initCategoryField()
})


//Initialisation des catégories du formulaire dans la seconde modale (select)
function initCategoryField() {
	const fragment = document.createDocumentFragment()
	for (const cat of allCats) {
		const option = document.createElement('option')
		option.value = cat.id
		option.innerHTML = cat.name
		fragment.appendChild(option)
	}
	const categoryField = document.querySelector('#category')
	categoryField.innerHTML = ''
	categoryField.appendChild(fragment)
}

//Requête (post) d'envoie des nouveaux projets
async function sendAddWork() {
	let formData = new FormData(formAddWork)

	const response = await fetch(apiUrl + "works", {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${userToken}`,
		},
		body: formData
	});
	console.log(response)
	//Si la réponse est correcte, on affiche le nouveau projet dans les galeries et on vide le formulaire de la modale
	if (response.ok) {
		const work = response.json()
		allWorks.add(await work)
		displayWorks()
		displayWorksIntoModal()
		formAddWork.reset()
		document.querySelector('#previewImage').src = "#"
		document.querySelector('.addImgContainer').classList.remove('hide');

		alert("Le formulaire a été envoyé avec succès.")
		closeModal()
	} else if (response.status === 401) {
		alert("Impossible de soumettre le formulaire car vous n'êtes pas authentifié.")
	} else if (response.status === 400) {
		alert("Le formulaire soumis est invalide")
	} else if (response.status === 500) {
		alert("Une erreur est survenue côté API")
	}
}

//ajout du EventListener sur le bouton (type submit) du formulaire
const btnAddWork = document.querySelector('.btnSubmit')

btnAddWork.addEventListener('click', function () {
	console.log(addWorkFormIsValid())
	if (addWorkFormIsValid()) {
		sendAddWork()
	} else {
		alert('Une donnée du formulaire est vide.');
	}
})

//récupération et vérificaion du contenu du formulaire
const formAddWork = document.querySelector('#addWorkForm')
const inputFile = document.querySelector('#image')

function addWorkFormIsValid() {
	let titleValue = formAddWork.querySelector('input[name="title"]').value;
	let imageValueIsNotNull = inputFile.files && inputFile.files[0];
	return titleValue !== null && titleValue !== undefined && titleValue.trim() !== '' && imageValueIsNotNull;
}

//ciblage de la zone de séléction de l'image, vérification du contenu et changements effectués sur la modale 
inputFile.onchange = (event) => {
	let target = event.target
	let selectedFile = target.files && target.files[0] ? target.files[0] : undefined;
	if (selectedFile != undefined) {
		var fileReader = new FileReader();
		fileReader.onload = function (fileEventReader) {
			document.querySelector('#previewImage').src = fileEventReader.target.result;
			document.querySelector('.addImgContainer').classList.add('hide')
			document.querySelector('.btnSubmit').classList.add('btnColor')
		};
		fileReader.readAsDataURL(selectedFile);
	} else {
		document.querySelector('.addImgContainer').classList.remove('hide')
	}
}
	

// Bouton Import Image
const addBtnImg = document.querySelector('.addImgBtn');
const importBtn = document.querySelector('#image');

addBtnImg.addEventListener('click', (event) => {
	//Reset de l'action sur l'importation pour éviter la redirection par défaut via preventDefault
	event.preventDefault();
	importBtn.click();
});

