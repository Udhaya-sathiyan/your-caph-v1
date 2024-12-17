 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSWWrVmoNGEwos6WCwxgXXE8wKOylG2Lk",
    authDomain: "your-caph.firebaseapp.com",
    databaseURL: "https://your-caph-default-rtdb.firebaseio.com/",
    projectId: "your-caph",
    storageBucket: "your-caph.appspot.com",
    messagingSenderId: "160074115856",
    appId: "1:160074115856:web:d6ebda7517356aecd25395",
    measurementId: "G-DQ77205PXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchdata() {
    const query = await getDocs(collection(db, "users"));
    let email=localStorage.getItem("email");    
    query.forEach((doc) => {
        let userData=doc.data();
        if(userData.email==email){
            document.querySelector(".userLogo").innerText=userData.username.slice(0,1);

        }
        
    });
}

fetchdata();
 


document.addEventListener("DOMContentLoaded",()=>{
    document.querySelector(".userLogo").innerText=localStorage.getItem("userName").slice(0,1);
    
    })
   
    document.addEventListener("DOMContentLoaded", function () {
        // Add click event listener for the logo
        const logo = document.getElementById("logoImage");
        const title = document.getElementById("dashboardTitle");
        const profile = document.getElementById("profileBox");

        // Define navigation for different areas
        logo.addEventListener("click", () => window.location.href = 'index.html'); // Or another home page URL
        title.addEventListener("click", () => window.location.href = 'index.html');
        profile.addEventListener("click", () => window.location.href = 'profile.html'); // Or another profile page

        // Add touch event for mobile (as touchstart event)
        logo.addEventListener("touchstart", () => window.location.href = 'index.html');
        title.addEventListener("touchstart", () => window.location.href = 'index.html');
        profile.addEventListener("touchstart", () => window.location.href = 'profile.html');

      
        
    });