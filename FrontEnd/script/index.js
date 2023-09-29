const apiUrl = "http://localhost:5678/api/works";
const filters = document.querySelector(".filters");
const modaleBack = document.getElementById('modale');
const divModale = document.querySelector('modaleBox');
const crossModale = document.querySelector('.cross-modale');
const topBar = document.querySelector('.top-info');
const editBtn = document.querySelector('.edit-btn');


//***************** Si pas connecté ********************/


/* MENTOR+NOUS
const apiUrl = "http://localhost:5678/api/"
const allWorks = new Set()
const allWorksID = new Set()
const allCats = new Set()
const gallery = document.querySelector("#gallery")

async function init() {
	const worksPromise = getDatabaseData("works")
	const catsPromise = getDatabaseData("categories")

	const [works, cats] = await Promise.all([worksPromise, catsPromise]);

	for (const work of works) {
		allWorks.add(work)
	}

	for (const workID of works) {
		allWorksID.add(workID.categoryId)
	}


	for (const cat of cats) {
		allCats.add(cat.name)
	}
	displayWorks()
	displayFilter()
}
init()*/

/* FILTRE MENTOR 
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
		figure.innerHTML = <img src="${work.imageUrl}" alt="${work.title}"/>
							<figcaption>${work.title}</figcaption>
		fragment.appendChild(figure)
	}
	gallery.appendChild(fragment)

}*/

// Initialisation de l'API
export const initApi = async () => {
	try {
		const responseWorks = await fetch(apiUrl);
		const allWorks = await responseWorks.json();
		return allWorks;
	} catch (error) {
		console.error(error);
	}
};

initApi();
generateFilters();
displayWorks();

// Fonction qui génére les différents filtres ainsi que leurs fonctionnalitées
async function generateFilters() {
	filters.innerHTML = "";
	const alltheWorks = await initApi();
	const Works = new Set();
	const categories = new Set();
	const categoriesId = new Set();
	categories.add("Tous");

	// Récupération des catégories dans l'API stocké dans allCategories
	for (let i = 0; i < alltheWorks.length; i++) {
		Works.add(alltheWorks);
		categories.add(alltheWorks[i].category.name);
		categoriesId.add(alltheWorks[i].category.id);

	}

	const allCategories = Array.from(categories);

	// Affichage des boutons en dynamique
	for (let i = 0; i < allCategories.length; i++) {
		const filterButton = document.createElement("button");
		filterButton.innerText = allCategories[i];
		filterButton.classList.add('filters-button');

		// Création des id des boutons
		let categoryId = 0;
		if (allCategories[i] === "Objets") {
			categoryId = 1;
		} else if (allCategories[i] === "Appartements") {
			categoryId = 2;
		} else if (allCategories[i] === "Hotels & restaurants") {
			categoryId = 3;
		}
		filterButton.dataset.id = categoryId;
		filters.appendChild(filterButton);
	}

	//Active la class 'Active' sur le bouton tous par défaut
	const allButtons = document.querySelectorAll('.filters-button');
	if (allButtons.length > 0) {
		const defaultButton = allButtons[0];
		defaultButton.classList.add('active');
	}
	// Retire la class 'Active' au précedent bouton
	allButtons.forEach(button => {
		button.addEventListener('click', (event) => {
			document.querySelector('.active').classList.remove("active");
			event.target.classList.add("active")
			displayWorks(event.target.dataset.id)
		});
	});
}

// Affichage des projets
async function displayWorks(categoryId = 0) {
	// En attente de l'initialisation
	const allWorks = await initApi();
	const fragment = document.createDocumentFragment()
	const gallery = document.getElementById('gallery');

	gallery.innerHTML = "";

	allWorks.forEach(project => {
		if (project.categoryId === categoryId || categoryId == 0) {
			const figure = document.createElement('figure');
			figure.innerHTML =
				`
			<img src="${project.imageUrl}" alt="${project.title}"/>				
			<figcaption>${project.title}</figcaption>
			`;
			fragment.appendChild(figure);
		}
	});
	gallery.appendChild(fragment);
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

//récupération des projets dans la modale. 
async function displayWorks2(categoryId = 0){
	const allWorks = await initApi();
	const fragment = document.createDocumentFragment();
	const figureModale = document.querySelector(".figure-img");

	figureModale.innerHTML = "",

	allWorks.forEach(project => {
		if (project.categoryId === categoryId || categoryId == 0) {
			const figure = document.createElement('figure');
			figure.innerHTML =
				`
			<img src="${project.imageUrl}" alt="${project.title}"/>				
			`;
			
			fragment.appendChild(figure);
		}
	}); 
	figureModale.appendChild(fragment);

}
//montrer la modale
function displayModale() {
	modaleBack.style.display = null
	crossModale.addEventListener('click', closeModal);
	displayWorks2();
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









