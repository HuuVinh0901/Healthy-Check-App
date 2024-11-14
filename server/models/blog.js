const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');  // Liên kết với mô hình User

const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING(255),
        allowNull: true,  // có thể trống
    },
}, {
    tableName: 'blogs',  // Tên bảng trong cơ sở dữ liệu
    timestamps: true,    // Tự động tạo createdAt và updatedAt
});

User.hasMany(Blog, { foreignKey: 'userId' });  // Liên kết với bảng User
Blog.belongsTo(User, { foreignKey: 'userId' }); // Một blog thuộc về một user

sequelize.sync()
    .then(() => console.log('Blog table created!'))
    .catch(err => console.error('Sync failed:', err));

module.exports = Blog;
