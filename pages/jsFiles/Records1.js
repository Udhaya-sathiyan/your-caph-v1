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



// Initialize default data or load from localStorage
const defaultData = {
    patients: {
        1: { id: 1, name: "John", age: 31, diagnosis: "Flu", details: "Mild symptoms" },
        2: { id: 2, name: "Jane", age: 28, diagnosis: "Allergy", details: "Seasonal allergy" }
    }
};

// Load from localStorage or set default
let patientsData = JSON.parse(localStorage.getItem("patientsData")) || defaultData;

// Save data back to localStorage
const saveData = () => {
    localStorage.setItem("patientsData", JSON.stringify(patientsData));
};

// Render the table dynamically
const renderTable = () => {
    const tbody = document.querySelector("#tb-patient tbody");
    tbody.innerHTML = ""; // Clear previous rows

    Object.values(patientsData.patients).forEach(patient => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.diagnosis}</td>
            <td>${patient.details}</td>
            <td>
                <button class="btn btn-danger delete-patient" data-id="${patient.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Attach delete event
    document.querySelectorAll(".delete-patient").forEach(button => {
        button.addEventListener("click", deletePatient);
    });
};

// Add a new patient
const addPatient = (event) => {
    event.preventDefault(); // Prevent form submission from reloading the page

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const diagnosis = document.getElementById("diagnosis").value.trim();
    const details = document.getElementById("details").value.trim();

    if (name && age && diagnosis && details) {
        const id = Date.now(); // Generate a unique ID
        patientsData.patients[id] = { id, name, age: Number(age), diagnosis, details };
        saveData();
        renderTable();

        // Clear the form
        document.getElementById("addPatientForm").reset();
    } else {
        alert("All fields are required!");
    }
};

// Delete a patient
const deletePatient = (event) => {
    const id = event.target.getAttribute("data-id");
    delete patientsData.patients[id];
    saveData();
    renderTable();
};

// Attach event listeners
document.getElementById("addPatientForm").addEventListener("submit", addPatient);

// Initial render of the table
renderTable();
