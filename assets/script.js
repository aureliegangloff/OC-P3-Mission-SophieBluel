// Récupération des travaux via L'API
const reponse = await fetch("http://localhost:5678/api/works");
const travaux = await reponse.json();

function afficherProjets(travaux) {
  const gallerie = document.querySelector(".gallery");
  for (let i = 0; i < travaux.length; i++) {
    const projet = document.createElement("figure");
    projet.innerHTML += `<img src="${travaux[i].imageUrl}" alt="${travaux[i].title}" />
            <figcaption>${travaux[i].title}</figcaption>`;
    gallerie.appendChild(projet);
  }
}

afficherProjets(travaux);
