const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 3000;
const tableName = 'games'
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = 'https://kkbudtrzmdwfydjhttgt.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

async function login(email, password) {
    const { user, session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login error:', error.message); // Log the error message
        return;
    }

    return session?.access_token; // Use optional chaining
}

const USER_TOKEN = login('mercury@gmail.com', '2212');

app.post('/submit', async (req, res) => {
    const answers = {};
    for (const [id, answer] of Object.entries(req.body)) {
        if (answer) answers[id] = answer;  // Store as key-value pairs in a single object
    }

    const { error } = await supabase.from(tableName)
        .insert([answers], { headers: { Authorization: `Bearer ${USER_TOKEN}` }});

    if (error) {
        console.error('Error saving data:', error);
        return res.status(500).send('Error saving data');
    } else {
        res.send('Thank you for submitting your answers!');
        console.log(answers);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
