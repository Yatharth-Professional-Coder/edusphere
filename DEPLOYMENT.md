# Deployment Guide for School Management System

This guide outlines how to deploy the School Management System using **Render** for the backend and **Vercel** for the frontend.

## Prerequisites

- GitHub Account
- [Render](https://render.com) Account
- [Vercel](https://vercel.com) Account
- MongoDB Atlas Cluster (connection string needed)

---

## 1. Backend Deployment (Render)

1.  **Log in to Render** and click **"New +"** > **"Web Service"**.
2.  **Connect ONLY your backend folder**:
    *   Select "Build and deploy from a Git repository".
    *   Connect your GitHub repository.
3.  **Configure the Service**:
    *   **Name**: `school-management-backend` (or similar)
    *   **Region**: Closest to you (e.g., Singapore, Frankfurt)
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start` (or `node index.js`)
4.  **Environment Variables**:
    Scroll down to "Environment Variables" and add:
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: `your_mongodb_connection_string`
    *   `JWT_SECRET`: `your_secure_jwt_secret`
5.  **Deploy**: Click "Create Web Service".
6.  **Copy URL**: Once deployed, copy the backend URL (e.g., `https://school-backend.onrender.com`). You will need this for the frontend.

---

## 2. Frontend Deployment (Vercel)

1.  **Log in to Vercel** and click **"Add New..."** > **"Project"**.
2.  **Import Git Repository**: Select your repository.
3.  **Configure Project**:
    *   **Framework Preset**: Vite (should auto-detect)
    *   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Build & Development Settings**:
    *   **Build Command**: `vite build` (Default)
    *   **Output Directory**: `dist` (Default)
    *   **Install Command**: `npm install` (Default)
5.  **Environment Variables**:
    *   Add `VITE_API_URL` with the value of your **Render Backend URL** (no trailing slash, e.g., `https://school-backend.onrender.com`).
    *   *Note: Ensure your frontend code uses `import.meta.env.VITE_API_URL` for API requests.*
6.  **Deploy**: Click "Deploy".

---

## 3. Verify Deployment

1.  Open the Vercel app URL.
2.  Try to **Login** to ensure the frontend can communicate with the backend.
3.  **Troubleshooting**:
    *   **404 on Refresh**: Verify `frontend/vercel.json` exists with rewrite rules.
    *   **CORS Error**: Ensure your backend `cors` configuration allows the Vercel domain. (You might need to update allowed origins in `backend/index.js` or `config/corsOptions.js` if strict CORS is enabled).
