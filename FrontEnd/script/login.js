


async function checkLogin() {

    // récupérer input + value
    const eMail = document.getElementById('email').value;
    const passWord = document.getElementById('password').value;

    const loginData = {

        email: eMail,
        password: passWord

    };

    const loginJSON = JSON.stringify(loginData);
    
    // recupère l'API
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
        alert("L'utilisateur n'existe pas !");
        return;
    } else if (result.error) {
        alert("Mot de passe incorrect !");
        return;
    //récupération du token.
    } else if (result.token) {
        
        sessionStorage.setItem("token", result.token);
        const userLogged = JSON.stringify(result);

        sessionStorage.setItem("loggedUser", userLogged);
        window.location.replace("/index.html");

    }
};

const connectBtn = document.querySelector("#formlogin");
connectBtn.addEventListener("submit", function (event) {
    event.preventDefault();
    checkLogin();
});