DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS usersTable;

CREATE TABLE usersTable (
    id SERIAL primary key,
    firstname VARCHAR (255) not null,
    lastname VARCHAR (255) not null,
    email VARCHAR (255) not null unique,
    password VARCHAR (255) not null,
    imageUrl VARCHAR(500),
    bio VARCHAR(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (
    id SERIAL primary key,
    receiver INT not null REFERENCES usersTable(id),
    sender INT not null REFERENCES usersTable(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
