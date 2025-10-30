import { readdirSync, readFileSync } from 'fs';
import path, { join, basename as _basename } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read config JSON
const configPath = path.resolve(__dirname, '../config/config.json');
const configJson = JSON.parse(readFileSync(configPath, 'utf-8'));
const env = process.env.NODE_ENV || 'development';
const config = configJson[env];

const db = {};
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load models
const files = readdirSync(__dirname).filter(file =>
  file.indexOf('.') !== 0 &&
  file !== _basename(__filename) &&
  file.slice(-3) === '.js' &&
  file.indexOf('.test.js') === -1
);

for (const file of files) {
  const filePath = join(__dirname, file);
  const fileUrl = pathToFileURL(filePath).href;
  const modelModule = await import(fileUrl);
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

// Setup associations

for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
