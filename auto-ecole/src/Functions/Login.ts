import axios from "axios";

const login = async (e: any, setLoginResponse: Function, setLoginError: Function, setToken: Function, socket: any) => {
    e.preventDefault();
    const email = document.getElementById('login-email') as HTMLInputElement;
    const password = document.getElementById('login-password') as HTMLInputElement;
    try {
        socket.emit('login', { mail: email.value, password: password.value });
        socket.on('login', (data: any) => {
            if (data.login) {
                console.log(data);
                setLoginResponse(true);
                setToken(data.token);
            } else {
                setLoginError('Login failed');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export { login }