const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');

const Cycle = sequelize.define('Cycle', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    cycleLength: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'cycles',
    timestamps: true,
});

User.hasMany(Cycle, { foreignKey: 'userId' });
Cycle.belongsTo(User, { foreignKey: 'userId' });
sequelize.sync()
    .then(() => console.log('Sleep table created!'))
    .catch(err => console.error('Sync failed:', err));
module.exports = Cycle;
