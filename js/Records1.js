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
   

// Patient Data
let patientsData = { patients: {} };
const savePatientsToLocalStorage = () => {
    localStorage.setItem("patients", JSON.stringify(patientsData.patients));
};

// Fetch Patient Data
const fetchPatientData = async () => {
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
        try {
            patientsData.patients = JSON.parse(storedPatients);
            renderTable();
            return;
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
        }
    } 

    try {
        const response = await fetch("/json/home.json");
        if (!response.ok) throw new Error("Failed to fetch patient data");
        patientsData = await response.json();
        renderTable();
        savePatientsToLocalStorage(); 
    } catch (error) {
        console.error("Error fetching patient data:", error);
    }
};

// Render Patient Table
const renderTable = () => {
    const tbody = document.querySelector("#tb-patient tbody");
    tbody.innerHTML = "";

    const patients = Object.values(patientsData.patients);
    if (patients.length === 0) {
        const row = `<tr><td colspan="5" style="text-align:center;">No patients found</td></tr>`;
        tbody.innerHTML = row;
        return;
    }

    patients.forEach(patient => {
        const row = `
            <tr>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.diagnosis}</td>
                <td>${patient.details}</td>
                <td>
                    <button class="btn btn-danger delete-patient" data-id="${patient.id}">Delete</button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", row);
    });

    attachDeleteEvents();
};



// Add New Patient
const addPatient = (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const diagnosis = document.getElementById("diagnosis").value.trim();
    const details = document.getElementById("details").value.trim();

    if (!validateForm(name, age, diagnosis, details)) return;

    const id = Date.now();
    patientsData.patients[id] = { id, name, age: Number(age), diagnosis, details };
    renderTable();
    savePatientsToLocalStorage();
    document.getElementById("addPatientForm").reset();
};

// Validate Form
const validateForm = (name, age, diagnosis, details) => {
    let isValid = true;
    document.querySelectorAll(".error").forEach(error => (error.textContent = ""));

    if (!/^[A-Za-z\s]+$/.test(name)) {
        document.getElementById("nameError").textContent = "Name must only contain letters.";
        isValid = false;
    }

    if (!/^\d{1,3}$/.test(age)) {
        document.getElementById("ageError").textContent = "Age must be a number (1-3 digits).";
        isValid = false;
    }

    if (!/^[A-Za-z\s]{3,50}$/.test(diagnosis)) {
        document.getElementById("diagnosisError").textContent = "Diagnosis must be 3-50 letters.";
        isValid = false;
    }

    if (!/^[A-Za-z\s]{5,100}$/.test(details)) {
        document.getElementById("detailsError").textContent = "Details must be 5-100 letters.";
        isValid = false;
    }

    return isValid;
};

// Delete Patient
const deletePatient = (event) => {
    const id = event.target.getAttribute("data-id");
    const confirmDelete = confirm("Are you sure you want to delete this patient?");
    if (confirmDelete) {
        delete patientsData.patients[id];
        renderTable();
        savePatientsToLocalStorage();
    }
};



document.getElementById("records").addEventListener("click", function () {
    window.location.href = "./patientRecord2.html"; // Replace with the actual path to your HTML file
});

// Attach Delete Events
const attachDeleteEvents =() => {
    document.querySelectorAll(".delete-patient").forEach(button => {
        button.addEventListener("click", (event) => {
            const patientId = event.target.getAttribute("data-id");
            deletePatient(patientId);
        });
    });
};

// Search Patient
const searchPatient = () => {
    const query = document.getElementById("searchBar").value.toLowerCase().trim();
    const rows = document.querySelectorAll("#tb-patient tbody tr");
    let matchFound = false;

    rows.forEach(row => {
        const nameCell = row.querySelector("td:first-child");
        if (nameCell) {
            const patientName = nameCell.textContent.toLowerCase();
            if (patientName.includes(query)) {
                row.style.display = "";
                matchFound = true;
            } else {
                row.style.display = "none";
            }
        }
    });

    const noResultsMessage = document.getElementById("noResultsMessage");
    noResultsMessage.style.display = matchFound ? "none" : "block";
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchPatientData();

    document.getElementById("addPatientForm").addEventListener("submit", addPatient);
    document.getElementById("searchBar").addEventListener("input", searchPatient);

    document.getElementById("addPatientButton").addEventListener("click", () => {
        document.getElementById("addPatientForm").style.display = "block";
    });
});