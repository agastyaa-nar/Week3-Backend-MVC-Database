-- No 1. Create Database n Table
CREATE TABLE Products(
  product_id INT PRIMARY KEY,
  product_name VARCHAR(100),
  category VARCHAR(50),
  price DECIMAL(10,2)
);

CREATE TABLE Inventory (
    inventory_id INT PRIMARY KEY,
    product_id INT,
    quantity INT,
    location VARCHAR(100),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE
);

CREATE TABLE OrderDetails (
    order_detail_id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- No 2. Insert Data ke Products
INSERT INTO Products VALUES 
(1, 'Laptop', 'Elektronik', 999.99),
(2, 'Meja Kursi', 'Perabot', 199.99),
(3, 'Printer', 'Elektronik', 299.99),
(4, 'Rak Buku', 'Perabot', 149.99);

-- No 3. Query untuk menampilkan semua produk beserta nama dan harganya, diurutkan berdasarkan harga dalam urutan menurun.
SELECT p.product_name, p.price
FROM Products p
ORDER BY p.price DESC;


-- No 4. Insert Data ke Inventory

INSERT INTO Inventory VALUES
(1, 1, 50, 'Gudang A'),
(2, 2, 30, 'Gudang B'),
(3, 3, 20, 'Gudang A'),
(4, 4, 40, 'Gudang B');

-- No 5. Query untuk menggabungkan tabel Produk dan Inventaris, yang menampilkan nama produk, kuantitas, dan lokasi untuk semua produk.

SELECT p.product_name, i.quantity, i.location
FROM Inventory i
JOIN Products p ON i.product_id = p.product_id;


-- No 6. Update Harga Laptop
UPDATE Products
SET price = 1099.99
WHERE product_name = 'Laptop';


-- No 7. Total Nilai Inventaris per Gudang
SELECT i.location, SUM(p.price * i.quantity) AS total_value
FROM Inventory i
JOIN Products p ON i.product_id = p.product_id
GROUP BY i.location;


-- No 8. Masukkan Data ke Orders dan OrderDetails
INSERT INTO Orders VALUES
(1, 101, '2024-08-12'),
(2, 102, '2024-08-13');

INSERT INTO OrderDetails VALUES
(1, 1, 1, 2),
(2, 1, 3, 1),
(3, 2, 2, 1),
(4, 2, 4, 2);


-- No 9. Total Pembayaran per Order
SELECT o.order_id, o.order_date, SUM(od.quantity * p.price) AS total_amount
FROM Orders o
JOIN OrderDetails od ON o.order_id = od.order_id
JOIN Products p ON od.product_id = p.product_id
GROUP BY o.order_id, o.order_date
ORDER BY o.order_id;


-- No 10. Produk yang Tidak Pernah Dipesan
SELECT p.product_id, p.product_name
FROM Products p
LEFT JOIN OrderDetails od ON p.product_id = od.product_id
WHERE od.product_id IS NULL;


-- No 11. Membuat Tampilan (View) Stok Saat Ini
CREATE VIEW StockView AS
SELECT p.product_name, i.quantity, i.location
FROM Inventory i
JOIN Products p ON i.product_id = p.product_id;

SELECT * FROM StockView;




