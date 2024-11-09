const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');  // Import User model

const Step = sequelize.define('Step', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  steps: {
    type: DataTypes.INTEGER,  // Số bước đi trong ngày
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,  // Ngày (YYYY-MM-DD)
    allowNull: false,
  }
}, {
  tableName: 'steps',
  timestamps: true,
});

// Thiết lập mối quan hệ với bảng `User`
Step.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Step, { foreignKey: 'userId' });

sequelize.sync()
  .then(() => console.log('Step table created!'))
  .catch(err => console.error('Sync failed:', err));

module.exports = Step;
