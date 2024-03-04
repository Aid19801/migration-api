require('dotenv').config();
import fetch from 'node-fetch'
import * as prismic from '@prismicio/client'

const token = process.env.PRISMIC_TOKEN
export const client = prismic.createClient(process.env.PRISMIC_REPO, { 
  fetch, 
  token
})