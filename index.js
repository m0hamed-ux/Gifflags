const express = require("express");
const cors = require("cors");
const { createClient } = require('@supabase/supabase-js')
require("dotenv").config()

const supabaseUrl = 'https://fkquoeqbzobpjlfeftfu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


const PORT = process.env.PORT || 3000;
const app = express()
app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:3000"
}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// SSR :
app.get("/", (req, res) => {
  res.render("index");
});

// API Endpoints
app.post("/handleIncrease", async (req, res) => {
    const countryName = req.body["countryName"];
    const { data, error } = await supabase
        .rpc('increment_score', { country_name: countryName });
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'Score incremented', data });
})
app.post("/handleDecrease", async (req, res) => {
    const countryName = req.body["countryName"];
    const { data, error } = await supabase
        .rpc('decrement_score', { country_name: countryName });
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'Score Decremented', country: countryName, data });
})
app.get("/Countries", (req, res) => {
    supabase
        .from('countries')
        .select('*')
        .order('score', { ascending: false })
        .then(({ data, error }) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.json(data);
        });
})
app.post("/updateGif", async (req, res) => {
    const countryName = req.body.countryName;
    const newGifUrl = req.body.gifUrl;
    if (!countryName || !newGifUrl) {
        console.log(req.body);
        return res.status(400).json({ error: "Country name and new GIF URL are required." });
    }
    const { data, error } = await supabase
        .from('countries')
        .update({ image: newGifUrl })
        .eq('name', countryName);
    if (error) {
        return res.status(500).json({ error: "error. please try again" });
    }
    res.json({ message: 'GIF updated successfully', data });
});

// Page not found
app.use((req, res) => {
  res.status(404).render("notfound", { url: req.originalUrl });
});


app.listen(PORT, () => {
    console.log(`up on ${PORT}`);
})