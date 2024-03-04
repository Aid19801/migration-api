import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { client } from './config.js';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'views')));

// Function to update the language in the documents and add alternate languages
const updateLanguageInDocuments = (documents, newLang) => {
    return documents.map((document) => {
      // Create the alternate language object
      const alternateLanguageObject = {
        id: document.id,
        type: 'languages',
        lang: 'en-sc',
      };
  
      // Add the alternate language object to the alternate_languages array
      document.alternate_languages = document.alternate_languages || [];
      document.alternate_languages.push(alternateLanguageObject);
  
      // Update the lang value to "en-za"
      document.lang = newLang;
  
      return document;
    });
  };
// Function to read, update, and save documents
const processAndSaveDocuments = (inputFilePath, outputFilePath, newLang) => {
    try {
      // Read the JSON file
      const rawData = fs.readFileSync(inputFilePath, 'utf-8');
      const jsonData = JSON.parse(rawData);
  
      // Update the language in the documents and add alternate languages
      const updatedDocuments = updateLanguageInDocuments(jsonData.documents, newLang);
  
      // Save the updated documents to a new JSON file
      fs.writeFileSync(outputFilePath, JSON.stringify({ documents: updatedDocuments }, null, 2));
      console.log(`Updated documents saved to ${outputFilePath}`);
    } catch (error) {
      console.error('Error processing and saving documents:', error.message);
    }
  };
  
app.use(async (req, res, next) => {
  try {
    const documents = await client.dangerouslyGetAll({ lang: 'en-sc' });

    // Save the fetched documents to a JSON file
    const inputFilePath = path.join(__dirname, 'documents.json');
    fs.writeFileSync(inputFilePath, JSON.stringify({ documents  }, null, 2));

    // Update the language and save the updated documents to a new JSON file
    const outputFilePath = path.join(__dirname, 'updated-documents.json');
    processAndSaveDocuments(inputFilePath, outputFilePath, 'en-za');
    res.send("Documents saved and updated");
  } catch (error) {
    console.error('Error fetching Prismic documents:', error.message);
    next(error);
  }
});

app.get('/', (req, res) => {
  res.send("Request received");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
