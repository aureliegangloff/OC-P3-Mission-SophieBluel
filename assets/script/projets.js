import {
  creerModale,
  toggleModale,
  afficherTravauxModale,
  supprimerTravauxModale,
  afficherAjoutPhoto,
} from "./modale.js";
/**
 * Affiche la liste des projets dans "Mes projets"
 * @param {Array} travaux
 */
export function afficherProjets(travaux) {
  const baliseGallerie = document.querySelector(".gallery");
  baliseGallerie.innerHTML = "";
  for (let i = 0; i < travaux.length; i++) {
    baliseGallerie.innerHTML += `
      <figure data-id="${travaux[i].id}">
        <img src="${travaux[i].imageUrl}" alt="${travaux[i].title}">
        <figcaption>${travaux[i].title}</figcaption>
      </figure>
    `;
  }
}

/**
 * Affiche les filtres categories et "Tous"
 * @param {Array} categories
 */
export function afficherFiltres(categories) {
  const baliseNav = document.createElement("nav");

  //création btn "Tous"
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

/**
 * Mise à jour de la liste des projets au clic sur un filtre
 * @param {Array} btnsFiltre
 * @param {Array} travaux
 */
export function filtrerProjet(travaux) {
  const btnsFiltre = document.querySelectorAll("#portfolio button");
  btnsFiltre.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      //ajout de la classe select sur le btn sélectionné
      for (let i = 0; i < btnsFiltre.length; i++) {
        btnsFiltre[i].classList.remove("select");
      }
      btn.classList.add("select");

      let categorieSelectionnee = event.target.dataset.id;
      let travauxFiltres = travaux;

      // On sélectionne les projets qui ont pour categorie la categorie cliquée
      if (categorieSelectionnee != 0) {
        travauxFiltres = travaux.filter(
          (projet) => projet.category.id === Number(categorieSelectionnee),
        );
      }

      afficherProjets(travauxFiltres);
    });
  });
}

/**
 * Affiche les élements HTML du mode "Edition"
 * @param {string} token
 * @param {Array} travaux
 * @param {Array} categories
 */
export function afficherModeEdition(token, travaux, categories) {
  const lienLogin = document.getElementById("lien-login");
  lienLogin.innerText = "logout";

  // Ajout de la bannière de login
  const banniereLogin = document.createElement("aside");
  banniereLogin.classList.add("banniere-login");
  banniereLogin.innerHTML += `<i class="fa-solid fa-pen-to-square"></i> Mode édition`;
  document.body.prepend(banniereLogin);

  // Ajout du bouton "modifier" sur le titre "Mes projets"
  const btnModifier = document.createElement("button");
  btnModifier.setAttribute("type", "button");
  btnModifier.classList.add("btn-modifier");
  const contenuBtnModifier = `<i class="fa-solid fa-pen-to-square"></i> modifier`;
  btnModifier.innerHTML += contenuBtnModifier;

  const baliseTitrePortfolio = document.querySelector("#portfolio h2");
  baliseTitrePortfolio.append(btnModifier);

  //Création de la modale
  creerModale();

  const modale = document.querySelector(".modale");
  const btnClose = document.querySelector(".modale-close");
  const modaleWrapper = document.querySelector(".modale-wrapper");
  if (modale) {
    //Ouverture/fermeture modale
    toggleModale(modale, btnModifier);
    toggleModale(modale, btnClose);
    toggleModale(modale, modale);
    // Gestion de l'affichage des projets
    afficherTravauxModale(travaux);
    supprimerTravauxModale(token);

    afficherAjoutPhoto(categories, token);
  }
}
