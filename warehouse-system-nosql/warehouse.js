// No 1 buat database warehouse dan buat colection untuk warehouse system
use('warehouse');

db.createCollection("Products");
db.createCollection("Inventory");
db.createCollection("Orders");


// No 2 Masukkan data berikut ke dalam Colections Products dengan isi data (_id, product_name, category, price) :
db.Products.insertMany([
  { '_id' : 1, 'product_name' : 'Laptop', 'category' : 'Elektronik', 'price' : 999.99 },
  { '_id' : 2, 'product_name' : 'Meja Kursi', 'category' : 'Perabot', 'price' : 199.99 },
  { '_id' : 3, 'product_name' : 'Printer', 'category' : 'Elektronik', 'price' : 299.99 },
  { '_id' : 4, 'product_name' : 'Rak Buku', 'category' : 'Perabot', 'price' : 149.99 }
])


// No 3 Tulis query untuk menampilkan semua produk beserta nama dan harganya, diurutkan berdasarkan harga dalam urutan menaik (Asceding).
db.Products.find({}, { _id: 0, product_name: 1, price: 1 }).sort({ 'price': 1 })


//No 4 Masukkan data berikut ke dalam Colection Inventory dengan isi data (_id, product_id, quantity, location) :
db.Inventory.insertMany([
  { '_id' : 1, 'product_id' : 1, 'quantity' : 50, 'location' : 'Gudang A' },
  { '_id' : 2, 'product_id' : 2, 'quantity' : 30, 'location' : 'Gudang B' },
  { '_id' : 3, 'product_id' : 3, 'quantity' : 20, 'location' : 'Gudang A' },
  { '_id' : 4, 'product_id' : 4, 'quantity' : 40, 'location' : 'Gudang B' }
])


// No 5 Tulis Query untuk menggabungkan tabel (aggregate) Produk dan Inventaris, yang menampilkan nama produk, kuantitas, dan lokasi untuk semua produk. Expected output:

db.Inventory.aggregate([
  { 
    $lookup : {
      from : "Products",
      localField : "product_id",
      foreignField : "_id",
      as : "product"
    }
  },
  { $unwind : "$product" },
  { 
    $project : {
      _id : 0,
      product_name : "$product.product_name",
      quantity : 1,
      location : 1
    }
  }
])


// No 6 Perbarui harga 'Laptop' menjadi 1099,99.
db.Products.updateOne({name: "Laptop"}, {$set: {price: 1099.99}})


// No 7 Tuliskan query untuk menghitung nilai total inventaris pada setiap gudang.
db.Inventory.aggregate([
  { 
    $lookup : {
      from : "Products",
      localField : "product_id",
      foreignField : "_id",
      as : "product"
    }
  },
  { $unwind : "$product" },
  { $project : {
      location : 1,
      value : { $multiply : ["$quantity", "$product.price"] }
    }
  },
  {
    $group : {
      _id : "$location",
      total_value : { $sum : "$value" } 
    }
  }   
])


// No 8 Masukkan data berikut ke dalam Colection Orders :
db.Orders.insertMany([
  { 
    '_id' : 1,
    'customer_id' : 101,
    'order_date' : ISODate("2024-08-12"),
    'order_details' : [
      { "product_id" : 1, "quantity" : 2 },
      { "product_id" : 3, "quantity" : 1 },
    ] 
  }, 
  { 
    '_id' : 2,
    'customer_id' : 102,
    'order_date' : ISODate("2024-08-13"),
    'order_details' : [
      { "product_id" : 2, "quantity" : 1 },
      { "product_id" : 4, "quantity" : 2 },
    ] 
  }, 
])


// No 9 Tulis Query untuk menampilkan jumlah total untuk setiap pesanan, termasuk order_id, order_date, dan total_amount.
db.Orders.aggregate([
  { $unwind: "$order_details" },
  {
    $lookup : {
      from : "Products",
      localField : "order_details.product_id",
      foreignField : "_id",
      as : "product"
    }
  },
  { $unwind : "$product"},
  {
    $project : {
      order_id : "$_id",
      order_date : 1,
      value : { $multiply : ["$order_details.quantity", "$product.price"]}
    }
  },
  {
    _id: {
      order_id: "$order_id",
      order_date: "$order_date"
    },
    total_amount: { $sum: "$value" }
  },
  {
    _id: 0,
    order_id: "$_id.order_id",
    order_date: "$_id.order_date",
    total_amount: { $round: ["$total_amount", 2] }
  }
])


// No 10 Tulis query untuk mencari produk yang belum pernah dipesan.
db.Products.aggregate([
  {
    $lookup: {
      from: "Orders",
      let: { pid: "$_id" },
      pipeline: [
        { $unwind: "$order_details" },
        { $match: { $expr: { $eq: ["$order_details.product_id", "$$pid"] } } }
      ],
      as: "orders"
    }
  },
  { $match: { orders: { $eq: [] } } },
  { $project: { _id: 0, product_name: 1 } }
]);