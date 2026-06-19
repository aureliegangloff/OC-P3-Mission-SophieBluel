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

if (!token) {
  afficherFiltres(categories);
}

const btnsFiltre = document.querySelectorAll("#portfolio button");
filtrerProjet(btnsFiltre, travaux);

if (token) {
  afficherModeEdition(token, travaux);
}
