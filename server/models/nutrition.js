const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');  // Import User model

const Nutrition = sequelize.define('Nutrition', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,  // Lượng calo tiêu thụ
    allowNull: false,
  },
  protein: {
    type: DataTypes.INTEGER,  // Lượng protein (tính bằng gram)
    allowNull: false,
  },
  carbs: {
    type: DataTypes.INTEGER,  // Lượng carbohydrate (tính bằng gram)
    allowNull: false,
  },
  fats: {
    type: DataTypes.INTEGER,  // Lượng chất béo (tính bằng gram)
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,  // Ngày (YYYY-MM-DD)
    allowNull: false,
  }
}, {
  tableName: 'nutritions',
  timestamps: true,
});

// Thiết lập mối quan hệ với bảng `User`
Nutrition.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Nutrition, { foreignKey: 'userId' });

sequelize.sync()
  .then(() => console.log('Nutrition table created!'))
  .catch(err => console.error('Sync failed:', err));

module.exports = Nutrition;
