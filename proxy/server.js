const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

// Use CORS to allow your frontend to access this backend
app.use(cors());

// Proxy route to fetch images
app.get('/proxy-image', async (req, res) => {
    const { url } = req.query; // Get image URL from query parameters

    if (!url) {
        return res.status(400).json({ error: 'Image URL is required' });
    }

    try {
        // Fetch the image using Axios
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Set the appropriate headers to indicate it's an image
        res.set('Content-Type', response.headers['content-type']);

        // Send the image as the response
        res.send(response.data);
    } catch (error) {
        console.error(`Error fetching image from Instagram: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
