const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/routes');
const sequelize = require('./sequelize'); // Kết nối Sequelize
const User = require('./models/user'); // Import model User của bạn
const path = require('path');
const fs = require('fs');
const uploadFolder = path.join(__dirname, 'uploads');

// Kiểm tra và tạo thư mục nếu chưa tồn tại
// if (!fs.existsSync(uploadFolder)) {
//     fs.mkdirSync(uploadFolder, { recursive: true });
// }

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/api', express.static(path.join(__dirname, 'uploads')));
const PORT = 3000;
const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ where: { role: 'admin' } });

        if (!existingAdmin) {
            const defaultAdmin = {
                name: 'Admin',
                email: 'admin@example.com',
                password: '1234',
                role: 'admin',
                gender: 'male'
            };

            await User.create(defaultAdmin);
            console.log('Default admin account created successfully!');
        } else {
            console.log('Admin account already exists.');
        }
    } catch (error) {
        console.error('Error creating default admin account:', error);
    }
};
sequelize.authenticate()
    .then(async () => {
        console.log('Connected to SQL Server via Sequelize');
        // Đồng bộ database và tạo tài khoản admin mặc định
        await sequelize.sync({ alter: false });
        await createDefaultAdmin(); // Tạo tài khoản admin
    })
    .catch(err => console.error('Unable to connect:', err));

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
