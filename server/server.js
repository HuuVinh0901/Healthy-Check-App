const express = require('express');
const userController = require('./controllers/UserController'); 

const app = express();
app.use(express.json());

app.post('/api/users', userController.addUser); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
