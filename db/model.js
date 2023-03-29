const { Sequelize, DataTypes, STRING } = require("sequelize");
var logger = require('../middleware/logger');

const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const sequelize = new Sequelize(
    process.env.DB,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT || 'mysql',
        maxConcurrentQueries: 100,
        dialectOptions: {
            ssl: 'Amazon RDS'
        },
        pool: { maxConnections: 5, maxIdleTime: 30 },
        language: 'en'
    }
);

if (process.env.NODE_ENV === 'dev') {
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
        logger.info('Connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database: ', error);
        logger.error('Unable to connect to the database');
    });

}
exports.User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

exports.Product = sequelize.define("product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 100
        }
    },
    date_added: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_last_updated: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

exports.Image = sequelize.define('image', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ETag: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ContentLength: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ContentType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    VersionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ServerSideEncryption: {
        type: DataTypes.STRING,
        allowNull: false
    },
    LastModified: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_created: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    product_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    s3_bucket_path: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

if (process.env.NODE_ENV === 'dev') {
    sequelize.sync().then(() => {
        console.log('User table created successfully!');
        logger.info('User table created successfully!');
    }).catch((error) => {
        console.error('Unable to create table : ', error);
        logger.error('Unable to create table : ', error);
    });
}