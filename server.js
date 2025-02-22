const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const tableName = 'games'
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_KEY, 'https://kkbudtrzmdwfydjhttgt.supabase.co');

app.use(cors());
app.use(express.json());

async function login(email, password) {
    const { user, session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        // console.error('Login error:', error.message);
        return;
    }
    return session?.access_token;
}

const USER_TOKEN = login('mercury@gmail.com', '05c8bd5d4dcdb18b690e160fd7a5c5190ee9ce7eb565d88f8e7b1f81b5f25bf6');

app.post('/submit', async (req, res) => {
    const answers = {};
    for (const [id, answer] of Object.entries(req.body)) {
        if (answer) answers[id] = answer;
    }

    const { error } = await supabase.from(tableName)
        .insert([answers], { headers: { Authorization: `Bearer ${USER_TOKEN}` }});

    if (error) {
        // console.error('Error saving data:', error);
        return res.status(500).send('Error saving data');
    } else {
        res.send('Thank you for submitting your answers!');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
