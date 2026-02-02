const https = require('https');

// ==========================================
// ⚠️ REPLACE THIS WITH YOUR RENDER BACKEND URL ⚠️
// Example: https://edusphere-backend.onrender.com
const BACKEND_URL = 'https://YOUR_BACKEND_URL_HERE.onrender.com';
// ==========================================

const userData = JSON.stringify({
    name: "Super Admin",
    email: "superadmin@edusphere.com",
    password: "SecurePassword123!",
    role: "superadmin",
    schoolId: null
});

if (BACKEND_URL.includes('YOUR_BACKEND_URL_HERE')) {
    console.error("❌ ERROR: You must update the BACKEND_URL in createSuperAdmin.js first!");
    process.exit(1);
}

const url = new URL(`${BACKEND_URL}/api/users`);

const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': userData.length
    }
};

console.log(`🔄 Attempting to create superadmin at ${BACKEND_URL}...`);

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
            console.log("\n✅ SUCCESS! Super Admin Created.");
            console.log("-----------------------------------");
            console.log(`Email:    superadmin@edusphere.com`);
            console.log(`Password: SecurePassword123!`);
            console.log("-----------------------------------");
            console.log("You can now login on your Vercel website.");
        } else {
            console.error(`\n❌ FAILED: Status ${res.statusCode}`);
            console.error("Response:", data);

            if (data.includes("User already exists")) {
                console.log("\n💡 Hint: A user with this email already exists.");
            }
        }
    });
});

req.on('error', (error) => {
    console.error("\n❌ Network Error:", error.message);
});

req.write(userData);
req.end();
