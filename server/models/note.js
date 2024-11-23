const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');  // Liên kết với mô hình User

const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Liên kết bắt buộc với user
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false, // Tiêu đề không được bỏ trống
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false, // Ngày không được bỏ trống
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true, // Mô tả có thể trống
    },
}, {
    tableName: 'notes',  // Tên bảng trong cơ sở dữ liệu
    timestamps: true,    // Tự động tạo createdAt và updatedAt
});

// Liên kết với bảng User
User.hasMany(Note, { foreignKey: 'userId' });  // Một user có nhiều note
Note.belongsTo(User, { foreignKey: 'userId' }); // Một note thuộc về một user

sequelize.sync()
    .then(() => console.log('Note table created!'))
    .catch(err => console.error('Sync failed:', err));

module.exports = Note;
