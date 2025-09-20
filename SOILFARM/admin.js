import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// 🔹 Replace with your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBdcANZECkd77EzLZ9rgXNgFMWEcCH6jbQ",
  authDomain: "soil-login-and-signup.firebaseapp.com",
  projectId: "soil-login-and-signup",
  storageBucket: "soil-login-and-signup.firebasestorage.app",
  messagingSenderId: "630896454836",
  appId: "1:630896454836:web:f2f9fbd1bda7c1df6ebbe1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================== Distributors ==================
async function loadDistributors() {
  const tableBody = document.querySelector("#distributorsTable tbody");
  tableBody.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "distributors"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = `<tr>
      <td>${data.name}</td>
      <td>${data.location}</td>
      <td>${data.contact}</td>
      <td>${data.cropsAvailable ? data.cropsAvailable.join(", ") : ""}</td>
      <td>
        <button onclick="editDistributor('${docSnap.id}', '${data.name}', '${data.location}', '${data.contact}', '${data.cropsAvailable}')">Edit</button>
        <button onclick="deleteDistributor('${docSnap.id}')">Delete</button>
      </td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

window.saveDistributor = async function() {
  const id = document.getElementById("distId").value;
  const name = document.getElementById("distName").value;
  const location = document.getElementById("distLocation").value;
  const contact = document.getElementById("distContact").value;
  const crops = document.getElementById("distCrops").value.split(",").map(c => c.trim());

  if (id) {
    await updateDoc(doc(db, "distributors", id), { name, location, contact, cropsAvailable: crops });
  } else {
    await addDoc(collection(db, "distributors"), { name, location, contact, cropsAvailable: crops });
  }
  clearDistributorForm();
  loadDistributors();
}

window.editDistributor = function(id, name, location, contact, crops) {
  document.getElementById("distId").value = id;
  document.getElementById("distName").value = name;
  document.getElementById("distLocation").value = location;
  document.getElementById("distContact").value = contact;
  document.getElementById("distCrops").value = crops;
}

window.deleteDistributor = async function(id) {
  await deleteDoc(doc(db, "distributors", id));
  loadDistributors();
}

function clearDistributorForm() {
  document.getElementById("distId").value = "";
  document.getElementById("distName").value = "";
  document.getElementById("distLocation").value = "";
  document.getElementById("distContact").value = "";
  document.getElementById("distCrops").value = "";
}

// ================== Soils ==================
async function loadSoils() {
  const tableBody = document.querySelector("#soilsTable tbody");
  tableBody.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "soils"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = `<tr>
      <td>${data.type}</td>
      <td>${data.characteristics}</td>
      <td>${data.suitableCrops ? data.suitableCrops.join(", ") : ""}</td>
      <td>
        <button onclick="editSoil('${docSnap.id}', '${data.type}', '${data.characteristics}', '${data.suitableCrops}')">Edit</button>
        <button onclick="deleteSoil('${docSnap.id}')">Delete</button>
      </td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

window.saveSoil = async function() {
  const id = document.getElementById("soilId").value;
  const type = document.getElementById("soilType").value;
  const characteristics = document.getElementById("soilCharacteristics").value;
  const crops = document.getElementById("soilCrops").value.split(",").map(c => c.trim());

  if (id) {
    await updateDoc(doc(db, "soils", id), { type, characteristics, suitableCrops: crops });
  } else {
    await addDoc(collection(db, "soils"), { type, characteristics, suitableCrops: crops });
  }
  clearSoilForm();
  loadSoils();
}

window.editSoil = function(id, type, characteristics, crops) {
  document.getElementById("soilId").value = id;
  document.getElementById("soilType").value = type;
  document.getElementById("soilCharacteristics").value = characteristics;
  document.getElementById("soilCrops").value = crops;
}

window.deleteSoil = async function(id) {
  await deleteDoc(doc(db, "soils", id));
  loadSoils();
}

function clearSoilForm() {
  document.getElementById("soilId").value = "";
  document.getElementById("soilType").value = "";
  document.getElementById("soilCharacteristics").value = "";
  document.getElementById("soilCrops").value = "";
}

// ================== Load on Page ==================
window.onload = function() {
  loadDistributors();
  loadSoils();
}
