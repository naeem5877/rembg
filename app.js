const express = require('express');
const multer = require('multer');
const { promisify } = require('util');
const rembg = require('rembg');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const removeBackground = promisify(rembg.remove);

app.post('/remove-background', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const outputBuffer = await removeBackground(req.file.buffer);
    const outputPath = `public/result-${Date.now()}.png`;

    fs.writeFileSync(outputPath, outputBuffer);

    res.json({ success: true, resultUrl: `/${outputPath}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
