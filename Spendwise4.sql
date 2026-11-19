USE spendwise;

INSERT INTO users (name, email, password_hash)
VALUES ('Test User', 'test@spendwise.com', 'test_hash');

SELECT id, name, email FROM users;