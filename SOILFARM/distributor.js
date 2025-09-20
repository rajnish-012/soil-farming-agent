import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// ================= Firebase Setup =================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= DOM Elements =================
const distNameEl = document.getElementById('distName');
const distContactEl = document.getElementById('distContact');
const distLocationEl = document.getElementById('distLocation');
const cropsContainer = document.getElementById('assignedCrops');
const cropSearch = document.getElementById('cropSearch');
const addCropBtn = document.getElementById('addCropBtn');

// ================= Data =================
let crops = [];
let distributorDocId = null; // Will store the fetched document ID

// ================= Load Distributor =================
async function loadProfile() {
  try {
    const distributorsCol = collection(db, "distributors");
    const snapshot = await getDocs(distributorsCol);

    if (snapshot.empty) {
      console.log("No distributors found!");
      return;
    }

    // Use the first document
    const docSnap = snapshot.docs[0];
    distributorDocId = docSnap.id;
    const data = docSnap.data();

    distNameEl.innerText = data.name || "N/A";
    distContactEl.innerText = data.contact || "N/A";
    distLocationEl.innerText = data.location || "N/A";

    crops = data.cropsAvailable || [];
    renderCrops(crops);

    console.log("Loaded distributor:", distributorDocId, data);
  } catch (err) {
    console.error("Error loading distributor:", err);
  }
}

// ================= Render Crops =================
function renderCrops(cropsArray) {
  cropsContainer.innerHTML = "";
  if (!cropsArray || cropsArray.length === 0) {
    cropsContainer.innerHTML = "<p>No crops available.</p>";
    return;
  }

  cropsArray.forEach((crop, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h4>${crop}</h4>
      <div style="margin-top:8px;">
        <button onclick="editCrop(${index})" style="margin-right:6px;">Edit</button>
        <button onclick="deleteCrop(${index})">Delete</button>
      </div>
    `;
    cropsContainer.appendChild(card);
  });
}

// ================= Add Crop =================
async function addCrop() {
  const newCrop = prompt("Enter new crop name:");
  if (!newCrop || crops.includes(newCrop)) {
    alert("Invalid or duplicate crop name!");
    return;
  }

  try {
    const docRef = doc(db, "distributors", distributorDocId);
    await updateDoc(docRef, { cropsAvailable: arrayUnion(newCrop) });
    crops.push(newCrop);
    renderCrops(crops);
  } catch (err) {
    console.error("Error adding crop:", err);
  }
}

// ================= Edit Crop =================
window.editCrop = async function(index) {
  const newName = prompt("Edit crop name:", crops[index]);
  if (!newName || crops.includes(newName)) {
    alert("Invalid or duplicate crop name!");
    return;
  }

  try {
    crops[index] = newName;
    const docRef = doc(db, "distributors", distributorDocId);
    await updateDoc(docRef, { cropsAvailable: crops });
    renderCrops(crops);
  } catch (err) {
    console.error("Error editing crop:", err);
  }
};

// ================= Delete Crop =================
window.deleteCrop = async function(index) {
  if (!confirm("Are you sure you want to delete this crop?")) return;

  try {
    crops.splice(index, 1);
    const docRef = doc(db, "distributors", distributorDocId);
    await updateDoc(docRef, { cropsAvailable: crops });
    renderCrops(crops);
  } catch (err) {
    console.error("Error deleting crop:", err);
  }
};

// ================= Search Crops =================
cropSearch.addEventListener('input', () => {
  const query = cropSearch.value.toLowerCase();
  const filtered = crops.filter(c => c.toLowerCase().includes(query));
  renderCrops(filtered);
});

// ================= Initialize =================
window.addEventListener('DOMContentLoaded', loadProfile);
addCropBtn.addEventListener('click', addCrop);

