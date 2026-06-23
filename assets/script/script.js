import {
  afficherProjets,
  afficherFiltres,
  filtrerProjet,
  afficherModeEdition,
  deconnecter,
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

if (!token) {
  afficherFiltres(categories);

  filtrerProjet(travaux);
} else {
  afficherModeEdition(token, travaux, categories);

  deconnecter(categories, travaux);
}
