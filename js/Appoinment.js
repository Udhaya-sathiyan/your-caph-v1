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
        const billingAndAppointments = JSON.parse(localStorage.getItem("billingAndAppointments")) || { billingAndAppointments: {} };
    
        const appointmentsTable = document.getElementById("appointmentsTable").querySelector("tbody");
        const searchBar = document.getElementById("searchBar");
        const appointmentForm = document.getElementById("appointmentForm");
        const patientSelect = document.getElementById("patientSelect");
        const doctorName = document.getElementById("doctorName");
        const appointmentDate = document.getElementById("appointmentDate");
        const appointmentTime = document.getElementById("appointmentTime");
        const saveButton = document.getElementById("saveButton");
        const cancelButton = document.getElementById("cancelButton");
        let editingAppointmentId = null;
    
        // Render Patient Options in the Select Dropdown
        const populatePatientOptions = () => {
            patientSelect.innerHTML = Object.values(patients)
                .map(patient => `<option value="${patient.id}">${patient.name}</option>`)
                .join("");
        };
    
        // Render Appointments Table
        const renderAppointmentsTable = () => {
            appointmentsTable.innerHTML = "";
            Object.values(billingAndAppointments.billingAndAppointments).forEach(record => {
                if (record.appointment) {
                    const patient = patients[record.patientId];
                    const row = `
                        <tr data-id="${record.patientId}">
                            <td>${patient?.name || "Unknown"}</td>
                            <td>${record.appointment.doctorName}</td>
                            <td>${record.appointment.date}</td>
                            <td>${record.appointment.time}</td>
                            <td>
                                <button class="edit-button">Edit</button>
                                <button class="delete-button">Delete</button>
                            </td>
                        </tr>
                    `;
                    appointmentsTable.insertAdjacentHTML("beforeend", row);
                }
            });
    
            // Attach Event Listeners for Actions
            document.querySelectorAll(".edit-button").forEach(button =>
                button.addEventListener("click", handleEditAppointment)
            );
            document.querySelectorAll(".delete-button").forEach(button =>
                button.addEventListener("click", handleDeleteAppointment)
            );
        };
    
        // Add or Edit Appointment
        const saveAppointment = () => {
            const selectedPatientId = patientSelect.value;
            const appointmentDetails = {
                doctorName: doctorName.value,
                date: appointmentDate.value,
                time: appointmentTime.value,
            };
    
            if (!selectedPatientId || !appointmentDetails.doctorName || !appointmentDetails.date || !appointmentDetails.time) {
                alert("All fields are required!");
                return;
            }
    
            if (editingAppointmentId) {
                billingAndAppointments.billingAndAppointments[editingAppointmentId].appointment = appointmentDetails;
            } else {
                billingAndAppointments.billingAndAppointments[selectedPatientId] = {
                    ...billingAndAppointments.billingAndAppointments[selectedPatientId],
                    patientId: selectedPatientId,
                    appointment: appointmentDetails,
                };
            }
    
            localStorage.setItem("billingAndAppointments", JSON.stringify(billingAndAppointments));
            renderAppointmentsTable();
            appointmentForm.style.display = "none";
        };
    
        // Edit Appointment
        const handleEditAppointment = (event) => {
            const patientId = event.target.closest("tr").dataset.id;
            const appointment = billingAndAppointments.billingAndAppointments[patientId]?.appointment;
    
            if (appointment) {
                editingAppointmentId = patientId;
                patientSelect.value = patientId;
                doctorName.value = appointment.doctorName;
                appointmentDate.value = appointment.date;
                appointmentTime.value = appointment.time;
                document.getElementById("formTitle").innerText = "Edit Appointment";
                appointmentForm.style.display = "block";
            }
        };
    
        // Delete Appointment
        const handleDeleteAppointment = (event) => {
            const patientId = event.target.closest("tr").dataset.id;
            delete billingAndAppointments.billingAndAppointments[patientId].appointment;
            localStorage.setItem("billingAndAppointments", JSON.stringify(billingAndAppointments));
            renderAppointmentsTable();
        };
    
        // Search Appointments
        searchBar.addEventListener("input", () => {
            const query = searchBar.value.toLowerCase();
            Array.from(appointmentsTable.rows).forEach(row => {
                const patientName = row.cells[0].textContent.toLowerCase();
                row.style.display = patientName.includes(query) ? "" : "none";
            });
        });
    
        // Initialize
        populatePatientOptions();
        renderAppointmentsTable();
    
        // Event Listeners
        saveButton.addEventListener("click", saveAppointment);
        cancelButton.addEventListener("click", () => {
            appointmentForm.style.display = "none";
            editingAppointmentId = null;
        });
    });
    
    
