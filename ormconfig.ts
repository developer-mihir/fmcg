require('dotenv').config()

export = {
    "name": 'default',
    "type": 'mysql',
    "host": process.env.DB_HOST || "127.0.0.1",
    "port": process.env.DB_PORT || "3306",
    "username": process.env.DB_USERNAME || "root",
    "password": process.env.DB_PASSWORD || "",
    "database": process.env.DB_DATABASE || "fmcg",
    "autoLoadEntities": true,
    "synchronize": true,
    "logging": false,
    "entities": [
        "dist/modules/**/*.entity.js",
    ],
    "migrations": ["src/migrations/*{.ts,.js}"],
    "migrationsTableName": "migrations",
    "migrationsRun": false,
    "cli": {
        "migrationsDir": "src/migrations"
    },
    "logger": "file"
}

