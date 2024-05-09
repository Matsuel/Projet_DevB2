function createSecret() {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ;,.-_'!@#$%^&*()"
    let secret = ""
    for (let i = 0; i < 128; i++) {
        secret += chars[Math.floor(Math.random() * chars.length)]
    }
    return secret
}

console.log(createSecret())