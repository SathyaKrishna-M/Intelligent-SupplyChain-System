# Installation Guide

## Prerequisites
1. **Java 17** or higher.
2. **Node.js** (v18+) and **npm**.

## Starting the Backend (Java API Server)
1. Open a terminal and navigate to the `src` directory:
   ```bash
   cd src
   ```
2. Compile the core engine and services:
   ```bash
   javac models/*.java storage/*.java datastructures/*.java datastructures/analytics/*.java services/*.java controllers/*.java api/*.java Main.java
   ```
3. Run the application:
   ```bash
   java Main
   ```
   *The server will start listening on `http://localhost:8080/api`.*

## Starting the Frontend (React SPA)
1. Open a **new** terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite Development Server:
   ```bash
   npm run dev
   ```
   *The UI will be accessible at `http://localhost:5173`.*

## Seeding Demo Data
To properly evaluate the system, log in as `admin` (password: `admin`), navigate to the **System Health** tab, and click **Load Demo Data**. This will populate the entire system with realistic test sets.
