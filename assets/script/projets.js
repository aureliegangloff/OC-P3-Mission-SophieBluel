/**
 * Affiche la liste des projets dans "Mes projets"
 * @param {Array} travaux
 */
export function afficherProjets(travaux) {
  const baliseGallerie = document.querySelector(".gallery");
  baliseGallerie.innerHTML = "";
  for (let i = 0; i < travaux.length; i++) {
    baliseGallerie.innerHTML += `
      <figure>
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
export function filtrerProjet(btnsFiltre, travaux) {
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

export function afficherModeEdition(token) {
  const lienLogin = document.getElementById("lien-login");
  if (token) {
    lienLogin.innerText = "logout";

    // Ajout de la bannière de login
    const banniereLogin = document.createElement("div");
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
  } else {
    lienLogin.innerText = "login";
  }
}
