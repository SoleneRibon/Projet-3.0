async function checkLogin() {
    // récupéreration des valeurs des inputs, 
    const eMail = document.getElementById('email').value;
    const passWord = document.getElementById('password').value;
    const loginData = {
         email: eMail,
        password: passWord
    };
    const loginJSON = JSON.stringify(loginData);
    // Envoie data à l'API via method: POST
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: loginJSON
    });
    const result = await response.json();
    // messages d'erreurs si on ne trouve pas dans l'API.
    if (result.message === "user not found") {
        alert("Le mot de passe et/ou l'E-mail sont inccorects");
        return;
    } else if (result.error) {
        alert("Le mot de passe et/ou l'E-mail sont inccorects");
        return;
    //récupération du token.
    } else if (result.token) {
        sessionStorage.setItem("token", result.token);
        const userLogged = JSON.stringify(result);
        sessionStorage.setItem("loggedUser", userLogged);
        window.location.replace("./index.html");
     }
};
      
//récupération du bouton et ajout de l'EventListener pour se connecter
const connectBtn = document.querySelector("#formlogin");
connectBtn.addEventListener("submit", function (event) {
    event.preventDefault();
    checkLogin();
});