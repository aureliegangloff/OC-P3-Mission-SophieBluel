// Récupération des travaux via L'API
const reponseTravaux = await fetch("http://localhost:5678/api/works");
const travaux = await reponseTravaux.json();

function afficherProjets(travaux) {
  const baliseGallerie = document.querySelector(".gallery");
  baliseGallerie.innerHTML = "";
  for (let i = 0; i < travaux.length; i++) {
    const projet = document.createElement("figure");
    projet.innerHTML += `<img src="${travaux[i].imageUrl}" alt="${travaux[i].title}" />
            <figcaption>${travaux[i].title}</figcaption>`;
    baliseGallerie.appendChild(projet);
  }
}

afficherProjets(travaux);

// Création des filtres de catégorie
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCategories.json();

function afficherFiltres(categories) {
  const baliseNav = document.createElement("nav");

  const btnTous = document.createElement("button");
  btnTous.setAttribute("type", "button");
  btnTous.dataset.id = 0;
  btnTous.innerText = "Tous";
  btnTous.classList.add("select");
  baliseNav.appendChild(btnTous);

  //création des filtres
  for (let i = 0; i < categories.length; i++) {
    const btnFiltre = document.createElement("button");
    btnFiltre.setAttribute("type", "button");
    btnFiltre.dataset.id = `${categories[i].id}`;
    btnFiltre.innerText += `${categories[i].name}`;
    baliseNav.appendChild(btnFiltre);
  }

  // Insertion dans le DOM avant la gallerie
  const baliseGallerie = document.querySelector(".gallery");
  baliseGallerie.parentNode.insertBefore(baliseNav, baliseGallerie);
}
afficherFiltres(categories);

// Au clic sur un filtre, on maj la liste des projets
const btnsFiltre = document.querySelectorAll("#portfolio button");
btnsFiltre.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    //ajout de la classe select sur le btn sélectionné
    btnsFiltre.forEach((btn) => {
      btn.classList.remove("select");
    });
    btn.classList.add("select");

    let categorieSelectionnee = event.target.dataset.id;
    let travauxFiltrer = travaux;

    // On sélectionne les projets qui ont pour categorie la categorie cliquée
    if (categorieSelectionnee != 0) {
      travauxFiltrer = travaux.filter(function (projet) {
        return projet.category.id === Number(categorieSelectionnee);
      });
    }

    afficherProjets(travauxFiltrer);
  });
});
