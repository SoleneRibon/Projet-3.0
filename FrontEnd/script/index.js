
const filters = document.querySelector(".filters");
const modaleBack = document.getElementById('modale');
const divModale = document.querySelector('.modaleBox');
const figureModale = document.querySelector('.figure-img')
const crossModale = document.querySelector('.cross-modale');
const topBar = document.querySelector('.top-info');
const editBtn = document.querySelector('.edit-btn');



//***************** Si pas connecté ********************/

const apiUrl = "http://localhost:5678/api/"
const allWorks = new Set()
const allCats = new Set()
const gallery = document.querySelector("#gallery")
const filtersDiv = document.querySelector("#filters")


async function init() {
	const worksPromise = getDatabaseData("works")
	const catsPromise = getDatabaseData("categories")
	const works = await Promise.all([worksPromise])
	const cats = await Promise.all([catsPromise])

	for (const work of works[0]) {
		allWorks.add(work)
	}

	for (const cat of cats[0]) {
		allCats.add(cat)
	}

	displayWorks()
	displayFilter()
}
init()

async function getDatabaseData(type) {
    try {
        const responseData = await fetch(apiUrl + type);
        const allData = await responseData.json();
        return allData;
    } catch (error) {
        console.error(error);
    }
};

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

function displayWorksIntoModal() {
	figureModale.innerHTML = ''
	const fragment = document.createDocumentFragment()
	for (const work of allWorks) {
		const figure = document.createElement("figure");
		figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"/>`
		fragment.appendChild(figure)
	}
	figureModale.appendChild(fragment)
}

function addFiltersHandler() {
	const filtersButton = document.querySelectorAll('.filters-button');
	for (const button of filtersButton) {
		button.addEventListener('click', function (event) {
			displayFilter(event.target.dataset.id)
			displayWorks(event.target.dataset.id)
		})
	}
}

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
		window.location.replace("/index.html")
	});
	//Récupération des filtres
	const filters = document.querySelector(".filters");
	//Disparition des filtres
	filters.style.display = "none";
	//apparition de la barre mode edit + Bouton modale
	topBar.style.display = null;
	editBtn.style.display = null;


}
/*********************************
 *********************************
 *********************************
	Modale fct
	
**********************************
**********************************
**********************************/


//montrer la modale
function displayModale() {
	modaleBack.style.display = null
	crossModale.addEventListener('click', closeModal);
	displayWorksIntoModal();
}
//fermer la modale
function closeModal() {
	
	modaleBack.style.display = "none"
	modaleBack.setAttribute('aria-hidden', 'true');	
}

modaleBack.addEventListener('click', function(event){
	if(event.target === modaleBack){
		closeModal();
	}
});

//récupération du bouton et ajout du listener pour montrer la modale

editBtn.addEventListener('click', () => {
	displayModale();

});









