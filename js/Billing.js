// Import Firebase libraries
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
    const email = localStorage.getItem("email");
    query.forEach((doc) => {
        const userData = doc.data();
        if (userData.email === email) {
            document.querySelector(".userLogo").innerText = userData.username.slice(0, 1);
        }
    });
}

fetchdata();

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".userLogo").innerText = localStorage.getItem("userName")?.slice(0, 1) || "?";

    // Fetch data from localStorage
    const patientsData = JSON.parse(localStorage.getItem("patients")) || {};
    const billingAppointmentsData = JSON.parse(localStorage.getItem("billingAppointmentsData")) || { billingAndAppointments: {} };

    // Table body reference
    const tbody = document.querySelector("#tb-patient tbody");

    // Modal references
    const modal = document.getElementById("updateModal");
    const closeModalButton = document.getElementById("closeModal");
    const saveChangesButton = document.getElementById("saveChanges");
    const serviceDescriptionInput = document.getElementById("serviceDescription");
    const statusInput = document.getElementById("status");
    const dateInput = document.getElementById("date");
    const AmountInput=document.getElementById("Amount");

    let currentPatientId = null;

    // Render Billing Table
    const renderBillingTable = () => {
        tbody.innerHTML = ""; // Clear existing rows

        const billingRecords = Object.values(billingAppointmentsData.billingAndAppointments);

        if (billingRecords.length === 0) {
            const row = `<tr><td colspan="6" style="text-align:center;">No billing records found</td></tr>`;
            tbody.innerHTML = row;
            return;
        }

        billingRecords.forEach(record => {
            const patient = patientsData[record.patientId];
            if (patient) {
                const row = `
                    <tr>
                        <td>${patient.name}</td>
                        <td>${record.billing.amount || "0"}</td>
                        <td>${record.billing.serviceDescription || "No services yet"}</td>
                        <td>${record.billing.status || "Unpaid"}</td>
                        <td>${record.billing.date || "N/A"}</td>
                        
                        <td>
                            <button class="btn btn-primary update-button" data-id="${record.patientId}">Update</button>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML("beforeend", row);
            }
        });

        // Attach event listeners to update buttons
        document.querySelectorAll(".update-button").forEach(button => {
            button.addEventListener("click", openUpdateModal);
        });
    };

    // Sync Billing Data when a new patient is added
    const syncBillingData = () => {
        Object.keys(patientsData).forEach(patientId => {
            if (!billingAppointmentsData.billingAndAppointments[patientId]) {
                // Add default billing and appointment details for the new patient
                billingAppointmentsData.billingAndAppointments[patientId] = {
                    patientId,
                    billing: {
                        amount: 0,
                        serviceDescription: "No services yet",
                        status: "Unpaid",
                        date: "N/A"
                    },
                    appointment: {
                        doctorName: "Not Assigned",
                        date: "N/A",
                        time: "N/A"
                    }
                };
            }
        });

        // Save updated billing data to localStorage
        localStorage.setItem("billingAppointmentsData", JSON.stringify(billingAppointmentsData));
    };

    // Open Update Modal
    const openUpdateModal = (event) => {
        currentPatientId = event.target.getAttribute("data-id");
        const record = billingAppointmentsData.billingAndAppointments[currentPatientId]?.billing;

        if (record) {
            serviceDescriptionInput.value = record.serviceDescription || "";
            statusInput.value = record.status || "";
            dateInput.value = record.date || "";
            AmountInput.value=record.amount ||"";
            modal.style.display = "block";
        }
    };

    // Close Modal
    const closeModal = () => {
        modal.style.display = "none";
        currentPatientId = null;
    };

    // Save Changes
    const saveChanges = () => {
        if (currentPatientId) {
            const updatedRecord = billingAppointmentsData.billingAndAppointments[currentPatientId].billing;
            updatedRecord.serviceDescription = serviceDescriptionInput.value;
            updatedRecord.status = statusInput.value;
            updatedRecord.date = dateInput.value;
            updatedRecord.amount =AmountInput.value;

            localStorage.setItem("billingAppointmentsData", JSON.stringify(billingAppointmentsData));
            renderBillingTable();
            closeModal();
        }
    };

    // Attach event listeners
    closeModalButton.addEventListener("click", closeModal);
    saveChangesButton.addEventListener("click", saveChanges);

    // Call syncBillingData to ensure both datasets are aligned
    syncBillingData();

    // Render the table
    renderBillingTable();
});

    //Search patient

    const searchPatient = () => {
        const query = document.getElementById("searchBar").value.toLowerCase().trim();
        const rows = document.querySelectorAll("#tb-patient tbody tr");
        let matchFound = false;
    
        rows.forEach(row => {
            const nameCell = row.querySelector("td:first-child");
            if (nameCell) {
                const patientName = nameCell.textContent.toLowerCase();
                if (patientName.includes(query)) {
                    row.style.display = ""; // Show the row
                    matchFound = true;
                } else {
                    row.style.display = "none"; // Hide the row
                }
            }
        });
    
        const noResultsMessage = document.getElementById("noResultsMessage");
        noResultsMessage.style.display = matchFound ? "none" : "block";
    };
    
    // Attach event listener to the search bar
    document.getElementById("searchBar").addEventListener("input", searchPatient);
