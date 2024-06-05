// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;


// Create an instance of Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb+srv://rahulmaji4955:FrBIlnRuDGSbQR8n@cluster0.1dl7qjn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


const locationSchema = new mongoose.Schema({
    lat: Number,
    lng: Number,
    detections: Object,
    area_name: String,
    image_path: String
}, { timestamps: true });

const Location = mongoose.model('Location', locationSchema);

// const processedImageSchema = new mongoose.Schema({

// })


// newLocation.save()
//     .then(location => {
//         console.log('Location saved:', location);
//     })
//     .catch(err => {
//         console.error('Error saving location:', err);
//     });


// Define a route
app.get('/', (req, res) => {
    res.send('Hello, this is your Node.js backend server!');
});

app.post("/upload_image", async (req, res) => {
    try {
        console.log(req.body); // Log the entire request body to inspect its structure


        // Extract data fields from the request body
        const lat = req.body.lat;
        const lng = req.body.lng;
        const detections = req.body.detections;
        const area_name = req.body.area_name;
        const image_path = req.body.image_path;

        console.log(detections.detectionsObj);

        // Create a new location document
        const newLocation = new Location({
            lat,
            lng,
            detections,
            area_name,
            image_path
        });

        const location = await newLocation.save();
        console.log('Location saved:', location);
        res.status(200).send({ message: "Location saved successfully", location });
    } catch (err) {
        console.error('Error saving location:', err);
        res.send({ message: "Failed to save location", error: err })
    }
});

app.get("/images", async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).send({ message: "Images fetched successfully", data: locations});
    } catch (err) {
        console.error('Error fetching images:', err);
        res.status(500).send({ message: "Failed to fetch images", error: err });
    }
})

// New route to fetch only lat, lng, and detections
app.get("/locations", async (req, res) => {
    try {
        const locations = await Location.find({}, 'lat lng detections');
        res.status(200).send({ message: "Locations fetched successfully", data: locations });
    } catch (err) {
        console.error('Error fetching locations:', err);
        res.status(500).send({ message: "Failed to fetch locations", error: err });
    }
});


// Start the server
const port = process.env.PORT || 3000; // Use the provided port or default to 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
