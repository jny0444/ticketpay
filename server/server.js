const express = require('express')
const { ReclaimProofRequest, verifyProof } = require('@reclaimprotocol/js-sdk')
require('dotenv').config();
const cors = require('cors')
 
const app = express()
const port = 5000
 

app.use(cors())
app.use(express.json())
app.use(express.text({ type: '*/*', limit: '50mb' }))
 
app.get('/reclaim/generate-config', async (req, res) => {
  const APP_ID = process.env.APP_ID;
  const APP_SECRET = process.env.APP_SECRET;
  const PROVIDER_ID = process.env.PROVIDER_ID;

//   console.log("App Id: " , APP_ID)   Working
 
  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)
    
    reclaimProofRequest.setAppCallbackUrl('https://localhost:5000/receive-proofs')
    
    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString()
 
    return res.json({ reclaimProofRequestConfig })
  } catch (error) {
    console.error('Error generating request config:', error)
    return res.status(500).json({ error: 'Failed to generate request config' })
  }
})


 
app.post('/receive-proofs', async (req, res) => {
    try {
      // Check if the body is a valid JSON string
      if (typeof req.body === 'string') {
        const proof = JSON.parse(req.body);
  
        // Verify the proof using the SDK verifyProof function
        const result = await verifyProof(proof);
        if (!result) {
          return res.status(400).json({ error: 'Invalid proofs data' });
        }
  
        console.log('Received proofs:', proof);
        // Process the proofs here
        return res.sendStatus(200);
      } else {
        throw new Error('Invalid request data');
      }
    } catch (error) {
      console.error('Error processing proofs:', error);
      return res.status(400).json({ error: 'Invalid request data' });
    }
  });
 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})