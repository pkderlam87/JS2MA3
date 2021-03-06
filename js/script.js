import displayMessage from "./components/displayMessage.js";
import { baseUrl } from "./settings/api.js";
import { saveToken, saveUser } from "./utils/storage.js";

const form = document.querySelector("form");
const userEmail = document.querySelector("#email");
const emailError = document.querySelector(".emailError");
const userPass = document.querySelector("#password");
const passError = document.querySelector(".passError");
const message = document.querySelector(".messageContainer");

form.addEventListener("submit", submitForm);

function submitForm(event) {
    event.preventDefault();
    message.innerHTML = "";

    const emailValue = userEmail.value.trim();
    const passValue = userPass.value.trim();

    if (validateEmail(emailValue) === true) {
        emailError.style.display = "none";
    } else {
        emailError.style.display = "block";
        return displayMessage("warning", "Email invalid", ".messageContainer");
    }

    if (checkLength(passValue, 3, 11) === true) {
        passError.style.display = "none";
    } else {
        passError.style.display = "block";
        return displayMessage("warning", "Password invalid", ".messageContainer");
    }
    doLogin(emailValue, passValue);
}

function validateEmail(email) {
    const regEx = /\S+@\S+\.\S+/;
    const patternMatches = regEx.test(email);
    return patternMatches;
}
function checkLength(passValue, minlen, maxlen) {
    if (passValue.length > minlen && passValue.length < maxlen) {
        return true;
    } else {
        return false;
    }
}
async function doLogin(username, password) {
    const url = baseUrl + "api/auth/local";
    const data = JSON.stringify({ identifier: username, password: password });
    const options = {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        const response = await fetch(url, options);
        const json = await response.json();
        if (json.user) {
            saveToken(json.jwt);
            saveUser(json.user);

            location.href = "https://pkderlam.one/portfolio";
        }

        if (json.error) {
            displayMessage("warning", json.error.message, ".messageContainer");
        }
    } catch (error) {
        console.log(error);
        displayMessage("warning", error, ".messageContainer");
    }
}