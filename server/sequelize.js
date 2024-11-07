const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('HealthyCheck', 'sa', 'sapassword', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
});

sequelize.authenticate()
  .then(() => console.log('Connected to SQL Server via Sequelize'))
  .catch(err => console.error('Unable to connect:', err));

module.exports = sequelize;
