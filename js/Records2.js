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
    let email = localStorage.getItem("email");
    query.forEach((doc) => {
        let userData = doc.data();
        if (userData.email == email) {
            document.querySelector(".userLogo").innerText = userData.username.slice(0, 1);
        }
    });
}
fetchdata();

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".userLogo").innerText = localStorage.getItem("userName").slice(0, 1);
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

// Generate PDF with billing and appointment details
function generatePDF(patient) {
    const { name, age, diagnosis, details, id: patientId } = patient;

    // Fetch billing and appointment data separately
    const billingData = JSON.parse(localStorage.getItem("billingAppointmentsData"))?.billingAndAppointments || {};
    const appointmentData = JSON.parse(localStorage.getItem("billingAndAppointments"))?.billingAndAppointments || {};

    const billing = billingData[patientId]?.billing || null;
    const appointment = appointmentData[patientId]?.appointment || null;

    const doc = new jsPDF();
    doc.setFont("Arial", "normal");

    // Patient details
    doc.text(`Patient Name: ${name}`, 10, 10);
    doc.text(`Age: ${age}`, 10, 20);
    doc.text(`Diagnosis: ${diagnosis}`, 10, 30);
    doc.text(`Details: ${details}`, 10, 40);

    // Billing details
    if (billing) {
        doc.text("Billing Details:", 10, 50);
        doc.text(`Service: ${billing.serviceDescription}`, 10, 60);
        doc.text(`Amount: $${billing.amount}`, 10, 70);
        doc.text(`Date: ${billing.date}`, 10, 80);
        doc.text(`Status: ${billing.status}`, 10, 90);
    } else {
        doc.text("No billing transactions found.", 10, 50);
    }

    // Appointment details
    const appointmentStartY = billing ? 100 : 60;
    if (appointment) {
        doc.text("Appointment Details:", 10, appointmentStartY);
        doc.text(`Doctor: ${appointment.doctorName}`, 10, appointmentStartY + 10);
        doc.text(`Date: ${appointment.date}`, 10, appointmentStartY + 20);
        doc.text(`Time: ${appointment.time}`, 10, appointmentStartY + 30);
    } else {
        doc.text("No appointment booked.", 10, appointmentStartY);
    }

    // Timestamp
    const timestamp = new Date().toLocaleString();
    doc.text(`Generated on: ${timestamp}`, 10, appointmentStartY + 50);

    return doc;
}

// Display patients and provide download option
function displayPatients(patients) {
    const pdfContainer = document.getElementById("pdfContainer");
    pdfContainer.innerHTML = "";

    Object.values(patients).forEach((patient) => {
        const pdfCard = document.createElement("div");
        pdfCard.className = "pdf-card";

        const title = document.createElement("h5");
        title.textContent = patient.name;

        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download PDF";
        downloadBtn.onclick = () => {
            const doc = generatePDF(patient);
            doc.save(`${patient.name}_Report.pdf`);
        };

        pdfCard.appendChild(title);
        pdfCard.appendChild(downloadBtn);
        pdfContainer.appendChild(pdfCard);
    });
}

// Load patients on page load
document.addEventListener("DOMContentLoaded", () => {
    const patients = fetchPatientsData();
    displayPatients(patients);
});

// Search functionality
function searchPatient() {
    const searchQuery = document.getElementById("searchPatient").value.trim().toLowerCase();
    const patients = fetchPatientsData();

    const filteredPatients = Object.values(patients).filter((p) =>
        p.name.toLowerCase().includes(searchQuery)
    );

    displayPatients(filteredPatients);
}

document.getElementById("searchPatient").addEventListener("keyup", searchPatient);
