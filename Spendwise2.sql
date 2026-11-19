USE spendwise;

INSERT INTO categories (user_id, name, type)
VALUES
(NULL, 'Food', 'expense'),
(NULL, 'Travel', 'expense'),
(NULL, 'Shopping', 'expense'),
(NULL, 'Bills', 'expense'),
(NULL, 'Salary', 'income'),
(NULL, 'Other Income', 'income');

SELECT * FROM categories;