import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/', (req,res) => {
    res.send("Hello!")
})
app.get("/api/places",  async (req,res) => {
    const query = req.query.query;
    const apiKey = 'AIzaSyDV9vvgvCz9W2YmXQHTcf_4lU93hCulmbU';
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({error: 'Failed'});
    }
    res.send("Server is ready234")
});

app.listen(5000, () => {
    console.log("Server started at  http://localhost:5000");
});