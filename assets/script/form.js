/**
 * Vérifie si le champ est vide
 * @param {HTMLElement} champ
 */
export function verifierChampVide(champ) {
  if (champ.value === "") {
    let nomChamp = document.getElementById("label" + champ.id).innerHTML;
    throw new Error(`Le champ ${nomChamp} est vide`);
  }
}

/**
 * Vérifie la syntaxe de l'email
 * @param {HTMLElement} email
 */
export function verifierEmail(email) {
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!regex.test(email.value)) {
    throw new Error("L'email est invalide");
  }
}

/**
 * Affiche le message d'erreur s'il existe
 * @param {string} message
 * @returns
 */
export function afficherMessageErreur(formulaire, message) {
  let baliseMessage = document.querySelector(".message-erreur");

  if (!message) {
    if (baliseMessage) {
      baliseMessage.remove();
    }
    return;
  }

  if (!baliseMessage) {
    baliseMessage = document.createElement("div");
    baliseMessage.classList.add("message-erreur");
    formulaire.appendChild(baliseMessage);
  }

  baliseMessage.textContent = message;
}
