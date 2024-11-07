const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); 

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'users', 
  timestamps: true,   
});


sequelize.sync()
  .then(() => console.log('Database & tables created!'))
  .catch(err => console.error('Sync failed:', err));

module.exports = User;
