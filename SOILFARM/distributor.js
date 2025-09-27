// ===============================
// 1. IMPORTS & FIREBASE CONFIG
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
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

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===============================
// 2. DOM ELEMENTS
// ===============================
const usernameEl = document.getElementById("username");

// Sections
const welcomeSection = document.querySelector(".welcome");
const addDistributorSection = document.getElementById("add-distributor");
const profileSection = document.getElementById("distributors");

// Form inputs
const distributorEmail = document.getElementById("distributor-email");
const distributorName = document.getElementById("Name");
const distributorContact = document.getElementById("distributor-contact");
const distributorLocation = document.getElementById("distributor-location");
const distributorCrops = document.getElementById("distributor-crops");

// Buttons
const saveBtn = document.getElementById("save-btn");
const clearBtn = document.getElementById("clear-btn");

// Table body
const distributorTable = document.getElementById("distributorTable");

// Navbar
const navLinks = document.querySelectorAll(".nav-link a");

// ===============================
// 3. USER AUTH HANDLING
// ===============================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      usernameEl.textContent =
        (userSnap.exists() ? userSnap.data().name : null) || user.displayName || user.email;

      distributorEmail.value = user.email;
      showSection("dashboard"); // default view
    } catch (error) {
      console.error("Error fetching user data:", error);
      usernameEl.textContent = user.displayName || user.email;
      distributorEmail.value = user.email;
      showSection("dashboard");
    }
  } else {
    window.location.href = "index.html"; // redirect if not logged in
  }
});

// ===============================
// 4. NAVBAR CLICK HANDLER
// ===============================
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navLinks.forEach((l) => l.classList.remove("active"));
    e.target.classList.add("active");

    const text = e.target.textContent.trim().toLowerCase();
    if (text === "dashboard") showSection("dashboard");
    else if (text === "profile") { showSection("profile"); loadDistributors(); }
    else if (text === "add details") showSection("add");
    else if (text === "logout") handleLogout();
  });
});

// ===============================
// 5. SECTION VISIBILITY HANDLER
// ===============================
function showSection(section) {
  welcomeSection.style.display = "none";
  addDistributorSection.style.display = "none";
  profileSection.style.display = "none";

  if (section === "dashboard") welcomeSection.style.display = "block";
  if (section === "add") addDistributorSection.style.display = "block";
  if (section === "profile") profileSection.style.display = "block";
}

// ===============================
// 6. LOGOUT FUNCTION
// ===============================
async function handleLogout() {
  try { await signOut(auth); window.location.href = "index.html"; }
  catch (err) { console.error("Logout error:", err); }
}

// ===============================
// 7. FORM SAVE / UPDATE HANDLER
// ===============================
let editingDocId = null; // track document being edited

saveBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in.");

  const name = distributorName.value.trim();
  const email = user.email;
  const contact = distributorContact.value.trim();
  const location = distributorLocation.value.trim();
  const crops = distributorCrops.value.split(",").map(c=>c.trim()).filter(Boolean);

  if (!name || !contact || !location || crops.length === 0) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    if(editingDocId) {
      // UPDATE
      const docRef = doc(db, "distributors", editingDocId);
      await updateDoc(docRef, { name, contact, location, cropsAvailable: crops });
      alert("✅ Distributor updated successfully!");
      editingDocId = null;
      saveBtn.textContent = "Save";
    } else {
      // ADD
      await addDoc(collection(db, "distributors"), { name, email, contact, location, cropsAvailable: crops, timestamp: new Date() });
      alert("✅ Distributor added successfully!");
    }

    // Reset form
    document.querySelector("form").reset();
    distributorEmail.value = email;

    // Refresh table if profile is open
    if(profileSection.style.display === "block") loadDistributors();
  } catch(err) {
    console.error(err);
  }
});

// ===============================
// 8. CLEAR FORM BUTTON
// ===============================
clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("form").reset();
  distributorEmail.value = auth.currentUser.email;
  saveBtn.textContent = "Save";
  editingDocId = null;
});

// ===============================
// 9. LOAD DISTRIBUTOR DATA (PROFILE VIEW)
// ===============================
async function loadDistributors() {
  const user = auth.currentUser;
  if(!user) return;

  distributorTable.innerHTML = "";

  const q = query(collection(db, "distributors"), where("email","==",user.email));
  const snapshot = await getDocs(q);

  if(snapshot.empty) {
    distributorTable.innerHTML = `<tr><td colspan="6" style="text-align:center;">No distributor records found.</td></tr>`;
    return;
  }

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${data.name}</td>
      <td>${data.email}</td>
      <td>${data.location}</td>
      <td>${data.contact}</td>
      <td>${data.cropsAvailable.join(", ")}</td>
      <td>
        <button class="update-btn" data-id="${docSnap.id}">Update</button>
        <button class="delete-btn" data-id="${docSnap.id}">Delete</button>
      </td>
    `;

    distributorTable.appendChild(tr);
  });

  attachRowActions();
}

// ===============================
// 10. ROW ACTIONS (UPDATE / DELETE)
// ===============================
function attachRowActions() {
  document.querySelectorAll(".update-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = btn.dataset.id;
      const docRef = doc(db,"distributors",id);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
        const data = docSnap.data();
        distributorName.value = data.name;
        distributorContact.value = data.contact;
        distributorLocation.value = data.location;
        distributorCrops.value = data.cropsAvailable.join(", ");
        showSection("add");
        saveBtn.textContent = "Update";
        editingDocId = id; // track doc being edited
      }
    });
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = btn.dataset.id;
      if(!confirm("Are you sure you want to delete this record?")) return;
      try {
        await deleteDoc(doc(db,"distributors",id));
        alert("🗑️ Distributor deleted successfully!");
        loadDistributors();
      } catch(err) { console.error(err); }
    });
  });
}

// ===============================
// 11. INITIALIZE DEFAULT VIEW
// ===============================
showSection("dashboard");
