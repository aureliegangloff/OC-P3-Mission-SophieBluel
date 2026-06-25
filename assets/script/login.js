import {
  verifierChampVide,
  verifierEmail,
  afficherMessageErreur,
} from "./form.js";

const formulaireLogin = document.querySelector("#login form");

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

      afficherMessageErreur(formulaireLogin, "");

      const login = {
        email: email.value,
        password: password.value,
      };
      await envoyerLoginAPI(login);
    } catch (erreur) {
      afficherMessageErreur(formulaireLogin, erreur.message);
    }
  });
}

envoiFormulaireLogin(formulaireLogin);
