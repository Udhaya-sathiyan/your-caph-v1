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

// Fetch user data from Firebase for authentication
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
   

// Fetch patient data from home.json and render the table
// Initialize patient data
let patientsData = { patients: {} };

// Load patient data from localStorage on page load
function loadPatientData() {
    const storedData = localStorage.getItem("patientsData");
    if (storedData) {
        patientsData = JSON.parse(storedData);
        renderTable(); // Render the table with loaded data
    }
}

// Save patient data to localStorage
function savePatientData() {
    localStorage.setItem("patientsData", JSON.stringify(patientsData));
}

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
            <td>
                <a href="details.html?id=${patient.id}" class="btn btn-primary">View Details</a>
            </td>
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



document.addEventListener("DOMContentLoaded", () => {
    // Get patient ID from query string
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get("id");

    // Load patient data from localStorage
    const storedData = localStorage.getItem("patientsData");
    const patientsData = storedData ? JSON.parse(storedData) : { patients: {} };

    if (patientId && patientsData.patients[patientId]) {
        const patient = patientsData.patients[patientId];
        // Display patient details
        document.getElementById("patientDetails").innerHTML = `
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Age:</strong> ${patient.age}</p>
            <p><strong>Diagnosis:</strong> ${patient.diagnosis}</p>
            <p><strong>Details:</strong> ${patient.details}</p>
        `;
    } else {
        document.getElementById("patientDetails").innerHTML = `
            <p>Patient details not found.</p>
        `;
    }
});


// Add a new patient
const addPatient = (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const diagnosis = document.getElementById("diagnosis").value.trim();
    const details = document.getElementById("details").value.trim();

    if (name && age && diagnosis && details) {
        const id = Date.now(); // Generate a unique ID
        patientsData.patients[id] = { id, name, age: Number(age), diagnosis, details };

        savePatientData(); // Save updated data to localStorage
        renderTable(); // Re-render the table

        // Clear the form
        document.getElementById("addPatientForm").reset();
    }
};

// Delete a patient
const deletePatient = (event) => {
    const id = event.target.getAttribute("data-id");
    const confirmDelete = confirm("Are you sure you want to delete this patient?");
    if (confirmDelete) {
        delete patientsData.patients[id];

        savePatientData(); // Save updated data to localStorage
        renderTable(); // Re-render the table
    }
};

// Search functionality to filter and highlight the patient
const searchPatient = () => {
    const query = document.getElementById("searchBar").value.toLowerCase().trim();
    const rows = document.querySelectorAll("#tb-patient tbody tr");

    rows.forEach(row => {
        const nameCell = row.querySelector("td:first-child");
        if (nameCell) {
            const patientName = nameCell.textContent.toLowerCase();
            if (patientName.includes(query)) {
                row.style.display = ""; // Show matching row
                row.classList.add("highlight");
                row.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                row.style.display = "none"; // Hide non-matching rows
                row.classList.remove("highlight");
            }
        }
    });
};

// Attach search event listener for dynamic filtering
document.getElementById("searchBar").addEventListener("input", searchPatient);
document.getElementById("addPatientForm").addEventListener("submit", addPatient);

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
    loadPatientData(); // Load patient data from localStorage
    renderTable(); // Render the table
});


document.getElementById("addPatientForm").addEventListener("submit", function () {
    let isValid = true;

    // Clear all previous error messages for relevant fields
    const errorFields = ["nameError", "ageError", "diagnosisError", "detailsError"];
    errorFields.forEach(id => {
        document.getElementById(id).textContent = "";
    });

    // Validate Name: Only letters and spaces
    const name = document.getElementById("name").value.trim();
    if (!/^[A-Za-z\s]+$/.test(name)) {
        document.getElementById("nameError").textContent = "Patient Name must only contain letters and spaces.";
        isValid = false;
    }

    // Validate Age: Only numbers, max 3 digits
    const age = document.getElementById("age").value.trim();
    if (!/^\d{1,3}$/.test(age) || parseInt(age) <= 0) {
        document.getElementById("ageError").textContent = "Age must be a positive number (up to 3 digits).";
        isValid = false;
    }

    // Validate Diagnosis: Only letters and spaces, min 3, max 50 characters
    const diagnosis = document.getElementById("diagnosis").value.trim();
    if (!/^[A-Za-z\s]{3,50}$/.test(diagnosis)) {
        document.getElementById("diagnosisError").textContent = "Diagnosis must contain only letters (3 to 50 characters).";
        isValid = false;
    }

    // Validate Details: Only letters and spaces, min 5, max 100 characters
    const details = document.getElementById("details").value.trim();
    if (!/^[A-Za-z\s]{5,100}$/.test(details)) {
        document.getElementById("detailsError").textContent = "Details must contain only letters (5 to 100 characters).";
        isValid = false;
    }

    

    // Prevent form submission if validation fails
    if (!isValid) {
        e.preventDefault();
    }
});
