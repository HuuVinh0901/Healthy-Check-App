const bcrypt = require('bcryptjs');
const User = require('../models/user');

const createDefaultAdmin = async () => {
    try {
        
        const existingAdmin = await User.findOne({ where: { role: 'admin' } });

        if (!existingAdmin) {
            const defaultAdmin = {
                name: 'Admin', 
                email: 'admin@example.com',
                password: await bcrypt.hash('1234', 10),
                role: 'admin',
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

createDefaultAdmin();
