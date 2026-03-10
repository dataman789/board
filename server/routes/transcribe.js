const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const audioFilePath = req.file.path;
    const response = await openai.createTranscription(
      fs.createReadStream(audioFilePath),
      'whisper-1',
    );
    const text = response.data.text;

    fs.unlinkSync(audioFilePath); // Delete the temp upload
    return res.json({ text });
  } catch (err) {
    return res.status(500).json({ error: 'Error transcribing audio' });
  }
});

module.exports = router;