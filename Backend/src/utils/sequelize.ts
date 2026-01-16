import { Sequelize } from 'sequelize-typescript';
import { MYSQL_DB_CONFIG_NEW } from './contants';
import { OrgUser } from '@models/orgUser';
import { Organization } from '@models/organization';
import { Admin } from '@models/admin';

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: MYSQL_DB_CONFIG_NEW.host,
  port: MYSQL_DB_CONFIG_NEW.port,
  username: MYSQL_DB_CONFIG_NEW.user,
  password: MYSQL_DB_CONFIG_NEW.password,
  database: MYSQL_DB_CONFIG_NEW.database,
  models: [OrgUser, Organization, Admin], // Register models here
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 50,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Sequelize connected to MySQL successfully');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database with Sequelize:', err);
  });

export default sequelize;
