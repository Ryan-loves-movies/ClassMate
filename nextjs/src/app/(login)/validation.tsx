const regEmail: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const regUsername: RegExp = /^[a-z][^\W_]{5,14}$/i;
const regPassword: RegExp = /^(?=[^a-z]*[a-z])(?=\D*\d)[^:~\s]{5,20}$/;

function isValidUsername(username: string) {
    return regUsername.test(username);
}

function isValidPassword(password: string) {
    return regPassword.test(password);
}

function isValidEmail(email: string) {
    return regEmail.test(email);
}

function validateUser(username: string, password: string, email: string) {
    if (!isValidUsername(username)) {
        console.log("Invalid username.");
        return false;
    }

    if (!isValidPassword(password)) {
        console.log("Invalid password.");
        return false;
    }

    if (!isValidEmail(email)) {
        console.log("Invalid email address.");
        return false;
    }

    console.log("User is valid.");
    return true;
}

export { regUsername, regPassword, regEmail };
export default validateUser;
