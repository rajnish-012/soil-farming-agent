# 🌱 Soil Farming Agent

## 📌 Description
Soil Farming Agent is a web-based platform designed to assist **farmers, distributors, and administrators** in managing agricultural resources effectively.  
The system provides role-based dashboards with features like authentication, soil dataset integration, and seamless user interaction through Firebase.

---
## 🌐 Live Demo

👉 [Try the SoilFarmingAgent Project here](https://soil-login-and-signup.web.app)


---

## ⚙️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Authentication & Hosting:** Firebase  
- **Database:** Firestore (Cloud Firestore rules included)  

---

## 📂 Project Structure
```
├── index.html              # Landing page
├── login.html              # User login page
├── register.html           # New user registration
├── admin_dashboard.html    # Admin role dashboard
├── distributor_dashboard.html # Distributor role dashboard
├── farmer_dashboard.html   # Farmer role dashboard
├── firebaseauth.js         # Firebase authentication logic
├── admin.js / distributor.js / farmer.js  # Role-specific scripts
├── *.css                   # Stylesheets for pages
├── firebase.json           # Firebase hosting config
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
```

---

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajnish-012/soil-farming-agent.git
   cd soil-farming-agent
   ```

2. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).  
   - Enable **Authentication** (Email/Password).  
   - Enable **Firestore Database**.  
   - Update your Firebase configuration inside `firebaseauth.js`.

3. **Deploy or Run locally**
   - To preview locally, just open `index.html` in a browser.  
   - To deploy:
     ```bash
     firebase login
     firebase init
     firebase deploy
     ```

---

## 💡 Features
- 🔑 User Authentication (Login/Register with Firebase)  
- 👨‍🌾 **Farmer Dashboard** – Access soil information & farming insights  
- 🚚 **Distributor Dashboard** – Manage distribution of resources  
- 🛠️ **Admin Dashboard** – Control and monitor overall system   

---

## 📸 Screenshots (Optional)
<img width="1919" height="974" alt="image" src="https://github.com/user-attachments/assets/d66e99f1-5f49-44f6-846b-af77f7610232" />


---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## 👨‍💻 Author
Developed by **Rajnish Kumar**
