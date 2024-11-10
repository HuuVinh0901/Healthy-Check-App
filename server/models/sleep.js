const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');  // Import User model

const Sleep = sequelize.define('Sleep', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  bedTime: {
    type: DataTypes.STRING,  
    allowNull: false,
  },
  wakeUp: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,  // Ngày (YYYY-MM-DD)
    allowNull: false,
  }
}, {
  tableName: 'sleeps',
  timestamps: true,
});

// Thiết lập mối quan hệ với bảng `User`
Sleep.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Sleep, { foreignKey: 'userId' });

sequelize.sync()
  .then(() => console.log('Sleep table created!'))
  .catch(err => console.error('Sync failed:', err));

module.exports = Sleep;
