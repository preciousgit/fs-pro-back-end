const path = require('path');
const fs = require('fs');

app.get('/images/:imageName', (req, res) => {
  const imagePath = path.join(__dirname, 'public', 'images', req.params.imageName);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({ error: 'Image not found' });
    } else {
      res.sendFile(imagePath);
    }
  });
});