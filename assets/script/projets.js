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

/** Mode Edition */
/**
 * Création de la modale
 */
function creerModale() {
  const modale = document.createElement("aside");
  modale.classList.add("modale");
  modale.classList.add("hidden");
  modale.innerHTML += `
    <div class="modale-wrapper">
      <h2>Galerie photo</h2>
      <div class="modale-gallery"></div>
      <hr />
      <button type="button" class="ajout-photo">Ajouter une photo</button>
      <button type="button" class="modale-close"><i class="fa-solid fa-xmark"></i></button>
    </div>
  `;

  const btnClose = document.querySelector(".modale-close");

  document.body.prepend(modale);
}
/**
 * Affichage de la modale
 * @param {HTMLElement} modale
 * @param {HTMLElement} btn
 */
function toggleModale(modale, btn) {
  if (btn) {
    if (btn === modale) {
      document
        .querySelector(".modale-wrapper")
        .addEventListener("click", (event) => {
          event.stopPropagation();
        });
    }
    btn.addEventListener("click", () => {
      modale.classList.toggle("hidden");
    });
  }
}
/**
 * Affiche les élements HTML du mode "Edition"
 * @param {string} token
 */
export function afficherModeEdition(token, travaux, categories) {
  const lienLogin = document.getElementById("lien-login");
  if (token) {
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

    // Changement texte du lien de navigation "Login"
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

      afficherTravauxModale(travaux);
      supprimerTravauxModale(travaux, token);

      afficherAjoutPhoto(categories);
    }
  } else {
    lienLogin.innerText = "login";
  }
}

function afficherTravauxModale(travaux) {
  const baliseGallerieModale = document.querySelector(".modale-gallery");
  baliseGallerieModale.innerHTML = "";
  for (let i = 0; i < travaux.length; i++) {
    baliseGallerieModale.innerHTML += `
      <figure>
        <img src="${travaux[i].imageUrl}" alt="${travaux[i].title}" width="77">
        <button type="button" id="${travaux[i].id}" class="btn-delete"><i class="fa-solid fa-trash-can"></i></button>
      </figure>
    `;
  }
}

function supprimerTravauxModale(travaux, token) {
  const boutonsSupprimer = document.querySelectorAll(".btn-delete");
  for (let i = 0; i < boutonsSupprimer.length; i++) {
    boutonsSupprimer[i].addEventListener("click", async (event) => {
      const idProjetCible = event.currentTarget.id;
      const reponse = await fetch(
        `http://localhost:5678/api/works/${idProjetCible}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (reponse.ok) {
        const reponseTravaux = await fetch("http://localhost:5678/api/works");
        travaux = await reponseTravaux.json();
        afficherTravauxModale(travaux);
        afficherProjets(travaux);

        supprimerTravauxModale(travaux, token);
      }
    });
  }
}

function afficherAjoutPhoto(categories) {
  const boutonAjouter = document.querySelector(".ajout-photo");
  boutonAjouter.addEventListener("click", () => {
    document.querySelector(".modale-wrapper h2").innerText = "Ajout photo";
    document.querySelector(".modale-gallery").remove();
    document.querySelector(".modale-wrapper hr").remove();
    boutonAjouter.remove();

    const elementFormulaire = document.createElement("form");
    elementFormulaire.classList.add("modale-form");
    elementFormulaire.setAttribute("method", "post");

    let optionsFormulaire = "";
    for (let i = 0; i < categories.length; i++) {
      optionsFormulaire += `<option value="${categories[i].id}">${categories[i].name}</option>`;
    }

    elementFormulaire.innerHTML = `
        <label for="photo" class="file-form">
          <i class="img-form"></i>
          <div class="btn-form">+ Ajouter photo</div>
          <p>jpg, png : 4mo max</p>
        </label>
        <input type="file" name="photo" id="photo" accept="image/png, image/jpeg" />
        <label for="titre">Titre</label>
        <input type="text" name="titre" id="titre" />
        <label for="categorie">Catégorie</label>
        <select id="categorie-form" name="categorie-form">
          ${optionsFormulaire}
        </select>
        <hr />
        <input type="submit" value="Valider" disabled />
    `;

    document.querySelector(".modale-wrapper").append(elementFormulaire);
  });
}
