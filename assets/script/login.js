const formulaireLogin = document.querySelector("#login form");

/**
 * Vérifie si le champ est vide
 * @param {HTMLElement} champ
 */
function verifierChampVide(champ) {
  if (champ.value === "") {
    throw new Error(`Le champ ${champ.id} est vide`);
  }
}
/**
 * Vérifie la syntaxe de l'email
 * @param {HTMLElement} email
 */
function verifierEmail(email) {
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
function afficherMessageErreur(message) {
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
    formulaireLogin.appendChild(baliseMessage);
  }

  baliseMessage.textContent = message;
}
/**
 * Gère le login
 * @param {object} login
 */
async function envoyerLoginAPI(login) {
  const reponse = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(login),
  });

  if (!reponse.ok) {
    throw new Error("Erreur dans l’identifiant ou le mot de passe");
  } else {
    const data = await reponse.json();
    const token = data.token;
    sessionStorage.setItem("token", token);
    window.location.href = "index.html";
  }
}
/**
 * Gestion du formulaire de login avec vérification des champs
 * @param {HTMLElement} formulaireLogin
 */
function envoiFormulaireLogin(formulaireLogin) {
  formulaireLogin.addEventListener("submit", async (event) => {
    try {
      event.preventDefault();

      let email = document.querySelector("[name=email]");
      verifierChampVide(email);
      let password = document.querySelector("[name=mdp]");
      verifierChampVide(password);

      verifierEmail(email);

      afficherMessageErreur("");

      const login = {
        email: email.value,
        password: password.value,
      };
      await envoyerLoginAPI(login);
    } catch (erreur) {
      afficherMessageErreur(erreur.message);
    }
  });
}

envoiFormulaireLogin(formulaireLogin);
