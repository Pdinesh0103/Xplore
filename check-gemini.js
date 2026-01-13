const https = require('https');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
let apiKey = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
}

if (!apiKey) {
    console.error("Could not find NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
    process.exit(1);
}

console.log("Using API Key ending in:", apiKey.slice(-4));

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`\nFetching models from: ${url.replace(apiKey, 'HIDDEN')}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("\nStatus Code:", res.statusCode);
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", JSON.stringify(json.error, null, 2));
            } else if (json.models) {
                console.log("\nAvailable Flash Models:");
                json.models.filter(m => m.name.includes("flash")).forEach(m => {
                    console.log(`- ${m.name}`);
                });
            } else {
                console.log("Response:", data);
            }
        } catch (e) {
            console.log("Raw Response:", data);
        }
    });
}).on('error', err => {
    console.error("Network Error:", err.message);
});
