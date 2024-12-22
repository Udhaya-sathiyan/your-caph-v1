import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCSWWrVmoNGEwos6WCwxgXXE8wKOylG2Lk",
    authDomain: "your-caph.firebaseapp.com",
    projectId: "your-caph",
    storageBucket: "your-caph.appspot.com",
    messagingSenderId: "160074115856",
    appId: "1:160074115856:web:d6ebda7517356aecd25395",
    measurementId: "G-DQ77205PXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Helper function to show error messages
function showMessage(message, elementId, color = "red") {
    const element = document.getElementById(elementId);
    element.style.color = color;
    element.textContent = message;
}

// Helper function to clear error messages
function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(message => {
        message.textContent = "";
    });
}

// Validate email format
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// Validate password format (min 6 characters)
function isValidPassword(password) {
    return password.length >= 6;
}

// Validate username (min 3 characters)
function isValidUsername(username) {
    return username.length >= 3;
}

// SignUp Validation and Logic
async function signUp(username, email, password, confirmPassword) {
    clearErrors();

    let isValid = true;

    if (!isValidUsername(username)) {
        showMessage("Username must be at least 3 characters long", "signUpUsernameError");
        isValid = false;
    }

    if (!isValidEmail(email)) {
        showMessage("Please enter a valid email", "signUpEmailError");
        isValid = false;
    }

    if (!isValidPassword(password)) {
        showMessage("Password must be at least 6 characters", "signUpPasswordError");
        isValid = false;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match", "confirmPasswordError");
        isValid = false;
    }

    if (!isValid) return;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", email), {
            uid: user.uid,
            username: username,
            email: email
        });

        localStorage.setItem("email", email);
        localStorage.setItem("userName", username);

        showMessage("Account created successfully!", "signUpMessage", "green");
        window.location.href = "/pages/home.html";
    } catch (error) {
        showMessage(`Error: ${error.message}`, "signUpMessage");
    }
}

// Login Validation and Logic
async function login(email, password) {
    clearErrors();

    if (!isValidEmail(email)) {
        showMessage("Please enter a valid email", "loginEmailError");
        return;
    }

    if (!isValidPassword(password)) {
        showMessage("Password must be at least 6 characters", "loginPasswordError");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("email", email);
        showMessage("Login successful!", "loginMessage", "green");
        window.location.href = "/pages/home.html";
    } catch (error) {
        showMessage(`Login error: ${error.message}`, "loginMessage");
    }
}

// Event listeners
document.getElementById("signUpForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("signUpUsername").value.trim();
    const email = document.getElementById("signUpEmail").value.trim();
    const password = document.getElementById("signUpPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    signUp(username, email, password, confirmPassword);
});

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    login(email, password);
});

// Switch between Login and Sign Up Forms
document.getElementById("showSignUpForm").addEventListener("click", () => {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signUpForm").style.display = "block";
});

document.getElementById("showLoginForm").addEventListener("click", () => {
    document.getElementById("signUpForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
});
