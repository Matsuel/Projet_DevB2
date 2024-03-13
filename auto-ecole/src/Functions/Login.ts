import axios from "axios";

const login = async (e: any, setLoginResponse: Function, setLoginError: Function) => {
    e.preventDefault();
    const email = document.getElementById('login-email') as HTMLInputElement;
    const password = document.getElementById('login-password') as HTMLInputElement;
    const response = await axios.post('http://localhost:3500/login', { mail: email.value, password: password.value });
    console.log(response.data.login);
    setLoginResponse(response.data.login);
    response.data.login === false ? setLoginError('Email ou mot de passe incorrect') : setLoginError('');
}

export { login }