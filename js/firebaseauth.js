import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

// Sign Up Function
async function signUp(username, password, email) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user details in Firestore
        await setDoc(doc(db, "users", email), {
            uid: user.uid,
            username: username,
            email: email
        });

        localStorage.setItem("email", email);
        localStorage.setItem("userName", username);

        showMessage("Account created successfully!", "signUpMessage", "green");
        window.location.href = "/pages/home.html"; // Redirect to home page
    } catch (error) {
        showMessage(`Error: ${error.message}`, "signUpMessage");
    }
}

// Login Function
async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);

        localStorage.setItem("email", email);
        showMessage("Login successful!", "loginMessage", "green");
        window.location.href = "/pages/home.html"; // Redirect to home page
    } catch (error) {
        showMessage(`Login error: ${error.message}`, "loginMessage");
    }
}

// Event listeners for form submission
document.getElementById("signUpForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("signUpUsername").value.trim();
    const email = document.getElementById("signUpEmail").value.trim();
    const password = document.getElementById("signUpPassword").value.trim();

    signUp(username, password, email);
});

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    login(email, password);
});
