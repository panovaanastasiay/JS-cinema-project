const login = document.querySelector(".login__form");
const email = document.querySelector(".login__email");
const password = document.querySelector(".login__password");



login.addEventListener('submit', (e) => {
    e.preventDefault();
    if(email.value.trim() && password.value.trim()) {
        const formData = new FormData(login);

        fetch( 'https://shfe-diplom.neto-server.ru/login',{
            method: 'POST',
            body: formData
        })
            .then( response => response.json())
            .then( function(data) {
                console.log(data);

                if(data.success === true) {
                    document.location="index_admin.html";
                }
                if(data.success === false){
                    alert("Неверный логин/пароль");
                }   
        })
    }
})