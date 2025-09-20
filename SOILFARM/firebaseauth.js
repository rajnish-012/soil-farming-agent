// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divid) {
  var messageDiv = document.getElementById(divid);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// ================= SIGN UP ==================
const signUp = document.getElementById("submitSignUp");
if (signUp) {
  signUp.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;
    const name = document.getElementById("rName").value;
    const role = document.getElementById("rRole").value; // Get role from dropdown

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: email,
          name: name,
          role: role, // store role in Firestore
        };

        showMessage("Account Created Successfully.", "signUpMessage");

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            localStorage.setItem("loggedInUserId", user.uid);
            localStorage.setItem("userRole", role);

            // Redirect based on role
            if (role === "farmer") {
              window.location.href = "farmer_dashboard.html";
            } else if (role === "distributor") {
              window.location.href = "distributor_dashboard.html";
            } else if (role === "admin") {
              window.location.href = "admin_dashboard.html";
            } else {
              window.location.href = "index.html"; // fallback
            }
          })
          .catch((error) => {
            console.error("Error writing document", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          showMessage("Email Address Already Exists !!!", "signUpMessage");
        } else {
          showMessage("Unable to Create User", "signUpMessage");
        }
      });
  });
}

// ================= SIGN IN ==================
const signIn = document.getElementById("submitSignIn");
if (signIn) {
  signIn.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const auth = getAuth();
    const db = getFirestore();

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          localStorage.setItem("loggedInUserId", user.uid);
          localStorage.setItem("userRole", userData.role);

          showMessage("Login Successful.", "signInMessage");

          // Redirect based on role
          if (userData.role === "farmer") {
            window.location.href = "farmer_dashboard.html";
          } else if (userData.role === "distributor") {
            window.location.href = "distributor_dashboard.html";
          } else if (userData.role === "admin") {
            window.location.href = "admin_dashboard.html";
          } else {
            window.location.href = "index.html"; // fallback
          }
        } else {
          showMessage("User data not found!", "signInMessage");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/wrong-password") {
          showMessage("Incorrect Password", "signInMessage");
        } else if (errorCode === "auth/user-not-found") {
          showMessage("No account found with this email", "signInMessage");
        } else if (errorCode === "auth/invalid-email") {
          showMessage("Invalid Email Format", "signInMessage");
        } else {
          showMessage("Login Failed: " + error.message, "signInMessage");
        }
      });
  });
}


