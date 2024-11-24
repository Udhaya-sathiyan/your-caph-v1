import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCSWWrVmoNGEwos6WCwxgXXE8wKOylG2Lk",
    authDomain: "your-caph.firebaseapp.com",
    projectId: "your-caph",
    storageBucket: "your-caph.firebasestorage.app",
    messagingSenderId: "160074115856",
    appId: "1:160074115856:web:d6ebda7517356aecd25395",
    measurementId: "G-DQ77205PXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Helper function to show messages
function showMessage(message, elementId, color = "red") {
    const element = document.getElementById(elementId);
    element.style.color = color;
    element.textContent = message;
}

// Sign Up Function
async function signUpWithUsername(username, password,email) {
    const usernameRef = doc(db, "usernames", username);
    const userRef = doc(db, "users", email); // Create a `users` collection to store user details
    const usernameSnap = await getDoc(usernameRef);

    if (usernameSnap.exists()) {
        showMessage("You already signedup.Please login");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store username in the 'usernames' collection
        await setDoc(usernameRef, { uid: user.uid });

        // Store additional user details in the 'users' collection
        await setDoc(userRef, {
            uid: user.uid,
            username: username,
            email: email,
        });
        localStorage.setItem("userName",username)
        showMessage("Account created successfully!", "signUpMessage", "green");
        window.location.href = "homepage.html"; // Ensure this page exists
    } catch (error) {
        showMessage(`Error creating user: ${error.message}`, "signUpMessage");
    }
}


// Login Function
async function loginWithUsername( password,email) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage("Login successful!", "loginMessage", "green");
        localStorage.setItem("email",email)
        window.location.href = "homepage.html"; // Ensure this page exists
    } catch (error) {
        showMessage(`Login error: ${error.message}`, "loginMessage");
    }
}

// Toggle forms
document.getElementById("showSignUpForm").addEventListener("click", () => {
    document.getElementById("signUpForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
});

document.getElementById("showLoginForm").addEventListener("click", () => {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signUpForm").style.display = "none";
});

// Clear error message when user starts typing in sign-up form
document.getElementById("signUpUsername").addEventListener("input", () => {
    document.getElementById("UserNameError").textContent = "";
});

document.getElementById("signUpPassword").addEventListener("input", () => {
    document.getElementById("PasswordError").textContent = "";
});

document.getElementById("confirmPassword").addEventListener("input", () => {
    document.getElementById("ConfirmPasswordError").textContent = "";
});

// // Clear error message when user starts typing in login form
// document.getElementById("loginUsername").addEventListener("input", () => {
//     document.getElementById("usernameError").textContent = "";
// });

document.getElementById("loginPassword").addEventListener("input", () => {
    document.getElementById("passwordError").textContent = "";
});

// Handle Sign Up form
document.getElementById("signUpForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("signUpUsername").value.trim();
    const email = document.getElementById("signUpEmail").value.trim();
    const password = document.getElementById("signUpPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    let hasErrors = false;

    // Validation
    if (username.length === 0) {
        showMessage("Please fill this field", "UserNameError");
        hasErrors = true;
    } else if (username.length < 3) {
        showMessage("Username must be at least 3 characters", "UserNameError");
        hasErrors = true;
    }
    else if(username.length>8){
        showMessage("Username can not exceed 15 characters");
        hasErrors = true;
    }

    if (password.length === 0) {
        showMessage("Please fill out this field", "PasswordError");
        hasErrors = true;
    } else if (password.length < 8 || !/^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
        showMessage("Password must be at least 8 characters and contain a number and a special character", "PasswordError");
        hasErrors = true;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match", "ConfirmPasswordError");
        hasErrors = true;
    }

    // Call signUpWithUsername only if there are no errors
    if (!hasErrors) {
        signUpWithUsername(username, password,email);
    }
});

// Handle Login form
document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    // const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const email = document.getElementById("loginEmail").value.trim();


    if ( !password) {
        showMessage("Please fill out all fields", "loginMessage");
    } else {
        loginWithUsername( password,email);
    }
});
