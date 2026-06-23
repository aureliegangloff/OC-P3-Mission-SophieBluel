import {
  afficherProjets,
  afficherFiltres,
  filtrerProjet,
  afficherModeEdition,
} from "./projets.js";

// Récupération des travaux via L'API
const reponseTravaux = await fetch("http://localhost:5678/api/works");
const travaux = await reponseTravaux.json();
// Récupération des categories via L'API
const reponseCategories = await fetch("http://localhost:5678/api/categories");
let categories = await reponseCategories.json();
categories = [...new Set(categories)]; // catégories uniques

// Mode edition
let token = window.sessionStorage.getItem("token");

afficherProjets(travaux);

/**
 * Gestion de la déconnexion
 * @param {Array} categories
 * @param {Array} travaux
 */
function deconnecter(categories, travaux) {
  const btnLogout = document.getElementById("lien-login");
  btnLogout.addEventListener("click", (event) => {
    sessionStorage.removeItem("token");
    btnLogout.innerText = "login";
    document.querySelector(".banniere-login").remove();
    document.querySelector(".btn-modifier").remove();
    document.querySelector(".modale").remove();
    afficherFiltres(categories);
    filtrerProjet(travaux);
    event.preventDefault();
  });
}

if (!token) {
  afficherFiltres(categories);

  filtrerProjet(travaux);
} else {
  afficherModeEdition(token, travaux, categories);

  deconnecter(categories, travaux);
}
