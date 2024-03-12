import { socket } from '@/pages/_app';

const login = (e: any) => {
    e.preventDefault();
    const email = document.getElementById('login-email') as HTMLInputElement;
    const password = document.getElementById('login-password') as HTMLInputElement;
    socket.emit('login', { mail: email.value, password: password.value });
}

export { login }