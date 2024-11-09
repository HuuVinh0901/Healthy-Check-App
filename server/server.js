const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/routes');
// Enable CORS
app.use(cors());

app.use(express.json());

app.use('/api',routes); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
