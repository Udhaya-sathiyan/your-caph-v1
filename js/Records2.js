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
    
    });
    


    const { jsPDF } = window.jspdf;
   

   // Fetch patients data from localStorage
   const fetchPatientsData = () => {
    const storedData = localStorage.getItem("patients");
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch (error) {
            console.error("Error parsing patients data:", error);
        }
    }
    return {}; // Return empty object if no data exists
};

// Display all patients
function displayPatients(patients) {
    const pdfContainer = document.getElementById("pdfContainer");
    pdfContainer.innerHTML = ""; // Clear existing content

    Object.values(patients).forEach((patient) => {
        const pdfCard = document.createElement("div");
        pdfCard.className = "pdf-card";

        const doc = generatePDFBlob(patient);
        const iframe = document.createElement("iframe");
        iframe.src = doc;

        const title = document.createElement("h5");
        title.textContent = patient.name;

        pdfCard.appendChild(title);
        pdfCard.appendChild(iframe);
        pdfContainer.appendChild(pdfCard);
    });
}

// Generate PDF Blob
function generatePDFBlob(patient) {
    const { name, age, diagnosis, details } = patient;
    const chemicalTest = "Positive";
    const physicalExam = "Good";
    const doctorName = "Dr. John Doe";
    const timestamp = new Date().toLocaleString();

    const doc = new jsPDF();
    doc.setFont("Arial", "normal");
    doc.text(`Patient Name: ${name}`, 10, 10);
    doc.text(`Age: ${age}`, 10, 20);
    doc.text(`Diagnosis: ${diagnosis}`, 10, 30);
    doc.text(`Details: ${details}`, 10, 40);
    doc.text(`Chemical Test Results: ${chemicalTest}`, 10, 50);
    doc.text(`Physical Examination: ${physicalExam}`, 10, 60);
    doc.text(`Doctor: ${doctorName}`, 10, 70);
    doc.text(`Date and Time: ${timestamp}`, 150, 70);

    return doc.output("bloburl");
}

// Search patient
function searchPatient() {
    const searchQuery = document.getElementById("searchPatient").value.trim().toLowerCase();
    const patients = fetchPatientsData();

    const filteredPatients = Object.values(patients).filter((p) =>
        p.name.toLowerCase().includes(searchQuery)
    );

    displayPatients(filteredPatients);
}

// Initial display
const patients = fetchPatientsData();
displayPatients(patients);