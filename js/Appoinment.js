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
        const patients = JSON.parse(localStorage.getItem("patients")) || {};
        const billingAppointments = JSON.parse(localStorage.getItem("billingAndAppointments")) || { billingAndAppointments: {} };
        const appointments = billingAppointments.billingAndAppointments;
    
        // DOM elements
        const tableBody = document.querySelector("#appointmentsTable tbody");
        const patientSelect = document.getElementById("patientSelect");
        const searchBar = document.getElementById("searchBar");
        const searchButton = document.getElementById("searchButton");
        const appointmentForm = document.getElementById("appointmentForm");
        const saveButton = document.getElementById("saveAppointment");
        const cancelButton = document.getElementById("cancelAppointment");
    
        // Populate patient dropdown
        const populatePatientDropdown = () => {
            patientSelect.innerHTML = "";
            Object.values(patients).forEach((patient) => {
                const option = document.createElement("option");
                option.value = patient.id;
                option.textContent = patient.name;
                patientSelect.appendChild(option);
            });
        };

    
    
        // Render appointments table
        const renderAppointments = (searchTerm = "") => {
            tableBody.innerHTML = ""; // Clear existing rows
            const filteredAppointments = Object.values(appointments).filter((record) => {
                const patient = patients[record.patientId];
                if (!patient) return false;
                return patient.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
        
            if (filteredAppointments.length === 0) {
                // Show "No results found" message
                const noResultsRow = `
                    <tr>
                        <td colspan="6" style="text-align: center;">No results found</td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML("beforeend", noResultsRow);
                return;
            }
        
            // Render filtered appointments
            filteredAppointments.forEach((record) => {
                const patient = patients[record.patientId];
                if (patient) {
                    const row = `
                        <tr>
                            <td>${patient.name}</td>
                            <td>${patient.age}</td>
                            <td>${record.appointment?.doctorName || "N/A"}</td>
                            <td>${record.appointment?.date || "N/A"}</td>
                            <td>${record.appointment?.time || "N/A"}</td>
                            <td>
                                <button data-id="${record.patientId}" class="edit-btn">Edit</button>
                                <button data-id="${record.patientId}" class="delete-btn">Delete</button>
                            </td>
                        </tr>
                    `;
                    tableBody.insertAdjacentHTML("beforeend", row);
                }
            });
        };


        
        
    
        // Add or update appointment
        const saveAppointment = () => {
            const patientId = patientSelect.value;
            const doctorName = document.getElementById("doctorName").value.trim();
            const date = document.getElementById("appointmentDate").value;
            const time = document.getElementById("appointmentTime").value;
        
            if (!patientId || !doctorName || !date || !time) {
                alert("Please fill all the fields.");
                return;
            }
        
            // Check if it's an update or a new appointment
            if (appointments[patientId]) {
                // Update existing appointment
                appointments[patientId].appointment = { doctorName, date, time };
            } else {
                // Add new appointment
                appointments[patientId] = {
                    patientId,
                    appointment: { doctorName, date, time },
                };
            }
        
            // Save to localStorage
            localStorage.setItem("billingAndAppointments", JSON.stringify(billingAppointments));
            renderAppointments();
            appointmentForm.style.display = "none"; // Hide form after saving
        };
        
    
        // Delete appointment
        const deleteAppointment = (id) => {
            if (confirm("Are you sure you want to delete this appointment?")) {
                delete appointments[id];
                localStorage.setItem("billingAndAppointments", JSON.stringify(billingAppointments));
                renderAppointments();
            }
        };
    
        // Event Listeners
        document.getElementById("addAppointmentBtn").addEventListener("click", () => {
            appointmentForm.style.display = "block"; // Show form
            populatePatientDropdown();
            saveButton.textContent = "Save"; // Set button text for adding new appointment
        });
    
        saveButton.addEventListener("click", (e) => {
            e.preventDefault();
            saveAppointment();
        });
    
        cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            appointmentForm.style.display = "none"; // Hide form without saving
        });
    
        tableBody.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            if (e.target.classList.contains("edit-btn")) {
                // Populate form for editing
                const record = appointments[id];
                if (record) {
                    document.getElementById("doctorName").value = record.appointment?.doctorName || "";
                    document.getElementById("appointmentDate").value = record.appointment?.date || "";
                    document.getElementById("appointmentTime").value = record.appointment?.time || "";
                    patientSelect.value = id;
                    appointmentForm.style.display = "block";
                    saveButton.textContent = "Update"; // Set button text for editing
                }
            } else if (e.target.classList.contains("delete-btn")) {
                deleteAppointment(id);
            }
        });   
       

        searchButton.addEventListener("click", () => {
            const searchTerm = searchBar.value.trim();
            renderAppointments(searchTerm); // Filter appointments
        });
        
        searchBar.addEventListener("input", () => {
            const searchTerm = searchBar.value.trim();
            renderAppointments(searchTerm); // Update table as user types
        });


    
        // Initial rendering
        populatePatientDropdown();
        renderAppointments();
    });


   


