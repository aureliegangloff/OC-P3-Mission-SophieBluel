import {
  afficherProjets,
  afficherFiltres,
  filtrerProjet,
  afficherModeEdition,
} from "./projets.js";

try {
  let travaux;
  let categories;

  // Récupération des travaux via L'API
  const reponseTravaux = await fetch("http://localhost:5678/api/works");

  travaux = await reponseTravaux.json();
  afficherProjets(travaux);

  const reponseCategories = await fetch("http://localhost:5678/api/categories");

  // Récupération des categories via L'API
  categories = await reponseCategories.json();

  // Mode edition
  const token = window.sessionStorage.getItem("token");
  if (!token) {
    afficherFiltres(categories);

    filtrerProjet(travaux);
  } else {
    afficherModeEdition(token, travaux, categories);

    deconnecter(categories, travaux);
  }
} catch (erreur) {
  const msgErreur = document.createElement("p");
  msgErreur.classList.add("empty-state");
  msgErreur.innerText = "Aucun projet à afficher.";
  document.querySelector("#portfolio").appendChild(msgErreur);
}

/**
 * Gestion de la déconnexion
 * @param {Array} categories
 * @param {Array} travaux
 */
function deconnecter(categories, travaux) {
  const btnLogout = document.getElementById("lien-login");
  btnLogout.addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.reload();
  });
}
