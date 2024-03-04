require('dotenv').config();
import axios from 'axios';
import disclaimerJson from './disclaimer.json' assert { type: 'json' };

const getUserSessionToken = async () => {
    console.log("fetching token...")
  try {
    const response = await axios.post(
      AUTH_ENDPOINT,
      {
        email: process.env.PRISMIC_USERNAME,
        password: process.env.PRISMIC_PASSWORD,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("🔴 failed to fetch user session token", error)
    throw error;
  }
};

// Junk Data Document Payload, switch out for real .map() data later
const documentPayload = {
  releaseId: 'sc-za-uploads',
  title: 'Testing 123',
  ...disclaimerJson,
};

getUserSessionToken().then(token => {
  console.log("✅ token received")
  axios.post(process.env.MIGRATION_URL, documentPayload, {
    headers: {
      'Content-Type': 'application/json',
      'repository': process.env.PRISMIC_REPO,
      'x-api-key': process.env.MIGRATION_API_KEY,
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(response => {
      console.log("✅ Document successfully posted", response)
    })
    .catch(error => {
      console.log("🔴 Error posting document: ", error.response.data)
    });
})
