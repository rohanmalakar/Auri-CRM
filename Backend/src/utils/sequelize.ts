import { Sequelize } from 'sequelize-typescript';
import { MYSQL_DB_CONFIG_NEW } from './contants';
import { OrgUser } from '@models/orgUser';
import { Organization } from '@models/organisation';
import { Admin } from '@models/admin';
import { OrgBranch } from '@models/branch';
import { LoyaltyProgram } from '@models/loyalty/loyaltyProgram';
import { PointsProgramRule } from '@models/loyalty/pointsProgramRule';
import { StampsProgramRule } from '@models/loyalty/stampsProgramRule';
import { PointsWalletDesign } from '@models/loyalty/pointsWalletDesign';
import { StampsWalletDesign } from '@models/loyalty/stampsWalletDesign';
import { StampsAccrualProduct } from '@models/loyalty/stampsAccrualProduct';
import { LoyaltyReward } from '@models/loyalty/loyaltyReward';
import { RewardCost } from '@models/rewardCost';
import { RewardDiscountRule } from '@models/loyalty/rewardDiscountRule';
import { RewardFreeProduct } from '@models/loyalty/rewardFreeProduct';

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: MYSQL_DB_CONFIG_NEW.host,
  port: MYSQL_DB_CONFIG_NEW.port,
  username: MYSQL_DB_CONFIG_NEW.user,
  password: MYSQL_DB_CONFIG_NEW.password,
  database: MYSQL_DB_CONFIG_NEW.database,
  models: [
    OrgUser,
    Organization,
    Admin,
    OrgBranch,
    LoyaltyProgram,
    PointsProgramRule,
    StampsProgramRule,
    PointsWalletDesign,
    StampsWalletDesign,
    StampsAccrualProduct,
    LoyaltyReward,
    RewardCost,
    RewardDiscountRule,
    RewardFreeProduct,
  ], // Register models here
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
