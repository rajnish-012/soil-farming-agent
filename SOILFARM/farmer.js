// farmer.js

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
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBdcANZECkd77EzLZ9rgXNgFMWEcCH6jbQ",
  authDomain: "soil-login-and-signup.firebaseapp.com",
  projectId: "soil-login-and-signup",
  storageBucket: "soil-login-and-signup.firebasestorage.app",
  messagingSenderId: "630896454836",
  appId: "1:630896454836:web:f2f9fbd1bda7c1df6ebbe1",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===============================
// 2. USER AUTH HANDLING
// ===============================
const usernameEl = document.getElementById("username");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        usernameEl.textContent =
          userData.name || user.displayName || user.email;
      } else {
        usernameEl.textContent = user.displayName || user.email;
      }

      // load dashboard data
      loadDashboardData();
    } catch (error) {
      console.error("Error fetching user data:", error);
      usernameEl.textContent = user.displayName || user.email;
      loadDashboardData();
    }
  } else {
    window.location.href = "index.html"; // redirect if not logged in
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
});

// ===============================
// 3. DASHBOARD DATA LOADER
// ===============================
async function loadDashboardData() {
  await loadSoils();
  await loadCrops();
  await loadDistributors();
}

// ===============================
// 4. SOIL INFO
// ===============================
async function loadSoils() {
  const soilCards = document.getElementById("soilCards");
  soilCards.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "soils"));
    querySnapshot.forEach((doc) => {
      const soil = doc.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h4>${soil.type || "Unknown Soil"}</h4>
        <p><b>pH:</b> ${soil.pH || "N/A"}</p>
        <p><b>Characteristics:</b> ${soil.characteristics || "N/A"}</p>
        <p><b>Suitable Crops:</b> ${
          Array.isArray(soil.suitableCrops)
            ? soil.suitableCrops.join(", ")
            : "N/A"
        }</p>
      `;
      soilCards.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading soils:", err);
  }
}

// ===============================
// 5. CROP RECOMMENDATIONS (Enhanced)
// ===============================
async function loadCrops() {
  const cropList = document.getElementById("cropList");
  cropList.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "soils"));
    let cropSoilMap = {};

    querySnapshot.forEach((doc) => {
      const soil = doc.data();
      if (soil.suitableCrops && Array.isArray(soil.suitableCrops)) {
        soil.suitableCrops.forEach((crop) => {
          if (!cropSoilMap[crop]) {
            cropSoilMap[crop] = [];
          }
          cropSoilMap[crop].push(soil.type);
        });
      }
    });

    // Display each crop with soil types
    Object.keys(cropSoilMap).forEach((crop) => {
      const li = document.createElement("li");
      li.textContent = `${crop} – Suitable in ${cropSoilMap[crop].join(", ")}`;
      cropList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading crops:", err);
  }
}


// ===============================
// 6. DISTRIBUTORS
// ===============================
async function loadDistributors() {
  const distributorTable = document.getElementById("distributorTable");
  distributorTable.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "distributors"));
    querySnapshot.forEach((doc) => {
      const dist = doc.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${dist.name || "N/A"}</td>
        <td>${dist.location || "N/A"}</td>
        <td>${dist.contact || "N/A"}</td>
        <td>${dist.cropsAvailable || "N/A"}</td>
      `;
      distributorTable.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading distributors:", err);
  }
}
