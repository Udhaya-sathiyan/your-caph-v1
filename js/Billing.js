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


    document.addEventListener("DOMContentLoaded", () => {
        // Fetch data from localStorage
        const patientsData = JSON.parse(localStorage.getItem("patients")) || {};
        const billingAppointmentsData = JSON.parse(localStorage.getItem("billingAppointmentsData")) || { billingAndAppointments: {} };
    
        // Table body reference
        const tbody = document.querySelector("#tb-patient tbody");
    
        // Render Billing Table
        const renderBillingTable = () => {
            tbody.innerHTML = ""; // Clear existing rows
        
            const billingRecords = Object.values(billingAppointmentsData.billingAndAppointments);
        
            if (billingRecords.length === 0) {
                const row = `<tr><td colspan="8" style="text-align:center;">No billing records found</td></tr>`;
                tbody.innerHTML = row;
                return;
            }
        
            billingRecords.forEach(record => {
                const patient = patientsData[record.patientId];
                if (patient) {
                    const row = `
                        <tr>
                            <td>${patient.name}</td>
                            <td>${record.billing.amount}</td>
                            <td>${record.billing.serviceDescription}</td>
                            <td>${record.billing.status}</td>
                            <td>${record.billing.date}</td>
                           
                        </tr>
                    `;
                    tbody.insertAdjacentHTML("beforeend", row);
                } else {
                    console.warn(`No patient found for patientId: ${record.patientId}`);
                }
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
                            doctorName: "Not Assigned", // Default doctor
                            date: "N/A", // Default appointment date
                            time: "N/A" // Default time
                        }
                    };
                }
            });
        
            // Save updated billing data to localStorage
            localStorage.setItem("billingAppointmentsData", JSON.stringify(billingAppointmentsData));
        };
    
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

    
    const deletePatient = (event) => {
        const id = event.target.getAttribute("data-id");
        const confirmDelete = confirm("Are you sure you want to delete this patient?");
        if (confirmDelete) {
            delete patientsData.patients[id];
            delete billingAppointmentsData.billingAndAppointments[id]; // Remove billing record
            renderTable();
            savePatientsToLocalStorage();
            localStorage.setItem("billingAppointmentsData", JSON.stringify(billingAppointmentsData)); // Update billing data
        }
    };
    