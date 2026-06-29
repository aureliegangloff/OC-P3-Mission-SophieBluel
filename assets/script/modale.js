import {
  verifierChampVide,
  verifierEmail,
  afficherMessageErreur,
} from "./form.js";

/** Mode Edition */
/**
 * Création de la modale
 */
export function creerModale() {
  const modale = document.createElement("aside");
  modale.classList.add("modale", "hidden");
  modale.innerHTML += `
    <div class="modale-wrapper">
      <h2>Galerie photo</h2>
      <div class="modale-gallery"></div>
      <hr />
      <button type="button" class="ajout-photo">Ajouter une photo</button>
      <button type="button" class="modale-close"><i class="fa-solid fa-xmark"></i></button>
    </div>
  `;
  document.body.appendChild(modale);
}
/**
 * Affichage de la modale
 * @param {HTMLElement} modale
 * @param {HTMLElement} btn
 */
export function toggleModale(modale, btn) {
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
 * Affiche la liste des travaux dans la modale
 * @param {Array} travaux
 */
export function afficherTravauxModale(travaux) {
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

/**
 * Supprime un projet au clic sur une corbeille
 * @param {string} token
 */
export function supprimerTravauxModale(token) {
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
        let projetSupprime = boutonsSupprimer[i].parentElement;
        projetSupprime.remove();
        document.querySelector(`[data-id="${idProjetCible}"]`).remove(); //suppression de l'image dans la page index
      }
    });
  }
}

/**
 * Afficher le contenu "Ajout de Photo" dans la modale
 * @param {Array} categories
 */
export function afficherAjoutPhoto(categories, token) {
  const boutonAjouter = document.querySelector(".ajout-photo");
  boutonAjouter.addEventListener("click", () => {
    document.querySelector(".modale-wrapper h2").innerText = "Ajout photo";
    document.querySelector(".modale-gallery").classList.add("hidden");
    document.querySelector(".modale-wrapper hr").classList.add("hidden");
    boutonAjouter.classList.add("hidden");

    if (!document.querySelector(".modale-form")) {
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
        <img src="" height="169" alt="Prévisualisation de l'image…" class="preview-img hidden" />
      </label>
      <input type="file" name="photo" id="photo" accept="image/png, image/jpeg" />
      <label for="titre" id="labeltitre">Titre</label>
      <input type="text" name="titre" id="titre" />
      <label for="categorie-form" id="labelcategorie-form">Catégorie</label>
      <select id="categorie-form" name="categorie-form" class="select-form">
        <option value=""></option>
        ${optionsFormulaire}
      </select>
      <hr />
      <input type="submit" class="btn-envoi-photo" value="Valider" />
      `;

      document.querySelector(".modale-wrapper").append(elementFormulaire);

      const btnRetour = document.createElement("button");
      btnRetour.classList.add("modale-back");
      btnRetour.setAttribute("type", "button");
      btnRetour.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
      document.querySelector(".modale-wrapper").append(btnRetour);
      retourModale();
      previewPhoto();
      console.log("Token avant POST :", token);
      envoyerFormulaireAjoutPhoto(token);
    } else {
      document.querySelector(".modale-form").classList.remove("hidden");
      document.querySelector(".modale-back").classList.remove("hidden");
    }
  });
}

/**
 * Gestion de l'affichage au click sur bouton "Retour" de la modale
 */
function retourModale() {
  const btnRetour = document.querySelector(".modale-back");

  btnRetour?.addEventListener("click", () => {
    document.querySelector(".modale-wrapper h2").innerText = "Galerie photo";
    document.querySelector(".modale-gallery").classList.remove("hidden");
    document.querySelector(".modale-wrapper hr").classList.remove("hidden");
    document.querySelector(".ajout-photo").classList.remove("hidden");

    document.querySelector(".modale-back").classList.add("hidden");
    document.querySelector(".modale-form").classList.add("hidden");
  });
}

/**
 * Affichage de la preview de la photo ajoutée
 */
function previewPhoto() {
  document.querySelector("#photo").addEventListener("change", () => {
    const preview = document.querySelector(".preview-img");
    const file = document.querySelector("#photo").files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        // on convertit l'image en une chaîne de caractères base64
        preview.src = reader.result;
      },
      false,
    );

    if (file) {
      reader.readAsDataURL(file);
    }
    document.querySelector(".file-form img").classList.remove("hidden");
    document.querySelector(".file-form").classList.add("hidden");
  });
}

/**
 * Ajout d'un projet à l'API
 * @param {FormData} FormData
 * @param {string} token
 */
async function envoiProjetAPI(formData, token) {
  console.log(token);
  const reponse = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!reponse.ok) {
    throw new Error("Erreur dans l'envoi du nouveau projet");
  } else {
    console.log("Projet créé !");
    const nouveauProjet = await reponse.json();
    return nouveauProjet;
  }
}
/**
 * Envoi du formulaire d'ajout de photo
 * @param {string} token
 */
function envoyerFormulaireAjoutPhoto(token) {
  const formulairePhoto = document.querySelector(".modale-form");
  const inputPhoto = document.querySelector("#photo");
  const inputTitre = document.querySelector(".modale-form #titre");
  const selectCategorie = document.querySelector("[name=categorie-form]");
  const submitButton = document.querySelector(".btn-envoi-photo");

  // Gestion de l'activation du bouton submit
  function activerSubmit() {
    submitButton.disabled = !(
      inputTitre.value.trim() !== "" &&
      selectCategorie.value !== "" &&
      inputPhoto.files.length > 0
    );
  }
  activerSubmit();
  inputTitre.addEventListener("input", activerSubmit);
  selectCategorie.addEventListener("change", activerSubmit);
  inputPhoto.addEventListener("input", activerSubmit);

  // Envoi du formulaire
  formulairePhoto.addEventListener("submit", async (event) => {
    try {
      event.preventDefault();

      // Vérification des champs
      verifierChampVide(inputTitre);
      verifierChampVide(selectCategorie);
      if (!inputPhoto.files.length) {
        throw new Error("Veuillez sélectionner une image");
      }

      // Envoi à l'API
      const formData = new FormData();
      formData.append("image", inputPhoto.files[0]);
      formData.append("title", inputTitre.value.trim());
      formData.append("category", selectCategorie.value);

      const nouveauProjet = await envoiProjetAPI(formData, token);

      //ajout du projet dans les galleries
      const baliseGallerie = document.querySelector(".gallery");
      baliseGallerie.innerHTML += `
      <figure data-id="${nouveauProjet.id}">
        <img src="${nouveauProjet.imageUrl}" alt="${nouveauProjet.title}">
        <figcaption>${nouveauProjet.title}</figcaption>
      </figure>
    `;

      const baliseGallerieModale = document.querySelector(".modale-gallery");
      baliseGallerieModale.innerHTML += `
      <figure>
        <img src="${nouveauProjet.imageUrl}" alt="${nouveauProjet.title}" width="77">
        <button type="button" id="${nouveauProjet.id}" class="btn-delete"><i class="fa-solid fa-trash-can"></i></button>
      </figure>
    `;
    } catch (erreur) {
      afficherMessageErreur(formulairePhoto, erreur.message);
    }
  });
}
