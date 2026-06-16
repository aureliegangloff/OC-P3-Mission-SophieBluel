const formulaireLogin = document.querySelector("#login form");

function verifierChamp(champ) {
  // Si le champ est vide, on lance une exception
  if (champ.value === "") {
    throw new Error(`Le champ ${champ.id} est vide`);
  }
}

function verifierEmail(email) {
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!regex.test(email.value)) {
    throw new Error("L'email est invalide");
  } else {
    console.log("Email valide");
  }
}

function afficherMessageErreur(message) {
  let baliseMessage = document.querySelector(".message-erreur");

  if (!baliseMessage) {
    baliseMessage = document.createElement("div");
    baliseMessage.classList.add("message-erreur");

    formulaireLogin.appendChild(baliseMessage);
  } else if (message === "") {
    baliseMessage.remove();
  }

  baliseMessage.innerText = message;
}

function envoiRequete(formulaireLogin) {
  formulaireLogin.addEventListener("submit", (event) => {
    try {
      event.preventDefault();

      let email = document.querySelector("[name=email]");
      verifierChamp(email);
      let password = document.querySelector("[name=mdp]");
      verifierChamp(password);

      verifierEmail(email);

      afficherMessageErreur("");

      //   //creation de l'objet login/mdp
      //   const login = {
      //     email: event.target.querySelector("[name=email]").value,
      //     password: event.target.querySelector("[name=mdp]").value,
      //   };
      //   // Création de la charge utile au format JSON
      //   const chargeUtile = JSON.stringify(login);
      //   // Appel de la fonction fetch avec toutes les informations nécessaires
      //   fetch("http://localhost:5678/api/users/login", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: login,
      //   });
    } catch (erreur) {
      afficherMessageErreur(erreur.message);
    }
  });
}

envoiRequete(formulaireLogin);
