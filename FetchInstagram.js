import axios from 'axios';
import { setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'; // Import getDoc to check for existing documents
import { db } from './firebase';

export const fetchInstagramData = async (usernames) => {
    console.log("FetchInstagram.js: fetchInstagramDataForUsernames function is called");

    // Check if the input is a valid array
    if (!Array.isArray(usernames) || usernames.length === 0) {
        console.error('Invalid input: usernames should be a non-empty array.');
        return;
    }

    // Iterate through each username
    for (const username of usernames) {
        console.log(`Processing username: ${username}`);

        // Check if the document already exists in Firestore
        const docRef = doc(db, 'artists', username);
        const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    const existingData = docSnap.data();
    const imageUrls = existingData.images || [];
    const fetchedAt = existingData.fetchedAt ? existingData.fetchedAt.toDate() : null;
    
    const time = new Date();
    time.setHours(time.getHours() - 72);

    // Skip refetch if data was fetched less than 72 hours ago
    if (fetchedAt > time) {
        console.log(`Data for ${username} was fetched recently. Skipping refetch.`);
        continue;
    }
}
        console.log(`Fetching data for username: ${username}`);

        const options = {
            method: 'GET',
            url: 'https://instagram-scraper-api2.p.rapidapi.com/v1.2/posts',
            params: {
                username_or_id_or_url: username
            },
            headers: {
                'x-rapidapi-key': '3864893b24msh6b2f3b02550cc10p1a8579jsn5b469774180d',
                'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const data = response.data;

            //console.log("Extracted Data:", data); // Logs the data object
            //console.log("Data Items:", data.data && Array.isArray(data.data.items) ? data.data.items : "data.data.items is not an array");

            if (data && data.data && data.data.items && Array.isArray(data.data.items)) {
                //console.log("Data and items array found in the response:", data.data.items);

                const imageUrls = [];
                for (const item of data.data.items) {
                    let imageVersions = item.image_versions; // Default to non-carousel posts

                    if (item.carousel_media && Array.isArray(item.carousel_media)) {
                        // Handle carousel posts
                        for (const media of item.carousel_media) {
                            imageVersions = media.image_versions;
                            if (imageVersions && Array.isArray(imageVersions.items)) {
                                const imageUrl = imageVersions.items[0]?.url;
                                if (imageUrl) {
                                    imageUrls.push(imageUrl);
                                    if (imageUrls.length >= 11) break;
                                }
                            }
                        }
                        if (imageUrls.length >= 11) break;
                    } else if (imageVersions && Array.isArray(imageVersions.items)) {
                        // Handle single-image posts
                        const imageUrl = imageVersions.items[0]?.url;
                        if (imageUrl) {
                            imageUrls.push(imageUrl);
                            if (imageUrls.length >= 11) break;
                        }
                    }

                    if (imageUrls.length >= 11) break;
                }

                if (imageUrls.length > 0) {
                    await setDoc(doc(db, 'artists', username), {
                        name: username,
                        images: imageUrls,
                        fetchedAt: serverTimestamp()
                    });
                    console.log(`Instagram data for ${username} successfully fetched and saved to Firestore.`);
                } else {
                    console.error(`No images found for username ${username} to save.`);
                }
            } else {
                console.error(`Data or items array not found in the response for username ${username}.`);
            }
        } catch (error) {
            console.error(`Error fetching Instagram data for username ${username} or saving to Firestore:`, error);
        }
    }
};

export default fetchInstagramData;