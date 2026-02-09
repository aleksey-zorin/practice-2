const express = require('express');
const app = express();
const port = 3000;

// Middleware для работы с JSON
app.use(express.json());

// Наш "массив-база данных" товаров
let products = [
  { id: 1, name: 'Ноутбук', price: 50000 },
  { id: 2, name: 'Смартфон', price: 30000 },
  { id: 3, name: 'Наушники', price: 5000 }
];

// ========== ГЛАВНАЯ СТРАНИЦА ==========
app.get('/', (req, res) => {
  res.send(`
    <h1>API для управления товарами</h1>
    <p>Доступные маршруты:</p>
    <ul>
      <li>GET <a href="/products">/products</a> - все товары</li>
      <li>GET /products/:id - товар по ID</li>
      <li>POST /products - создать товар</li>
      <li>PUT /products/:id - обновить товар</li>
      <li>DELETE /products/:id - удалить товар</li>
    </ul>
    <p>Перейди по <a href="/products">ссылке</a> чтобы увидеть товары</p>
  `);
});

// ========== CRUD ОПЕРАЦИИ ==========

// 1. GET /products — получить ВСЕ товары
app.get('/products', (req, res) => {
  res.json(products);
});

// 2. GET /products/:id — получить товар по ID
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

// 3. POST /products — создать новый товар
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Укажите название и цену' });
  }
  
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    price: Number(price)
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 4. PUT /products/:id — обновить товар
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price } = req.body;
  
  const productIndex = products.findIndex(p => p.id == productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  
  // Обновляем только переданные поля
  if (name !== undefined) products[productIndex].name = name;
  if (price !== undefined) products[productIndex].price = Number(price);
  
  res.json(products[productIndex]);
});

// 5. DELETE /products/:id — удалить товар
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  const initialLength = products.length;
  
  products = products.filter(p => p.id != productId);
  
  if (products.length < initialLength) {
    res.json({ message: 'Товар удалён' });
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

// Старт сервера
app.listen(port, () => {
  console.log(`✅ Сервер запущен на http://localhost:${port}`);
  console.log('📋 Доступные маршруты:');
  console.log('  GET    /              - главная страница');
  console.log('  GET    /products      - все товары');
  console.log('  GET    /products/:id  - товар по ID');
  console.log('  POST   /products      - создать товар');
  console.log('  PUT    /products/:id  - обновить товар');
  console.log('  DELETE /products/:id  - удалить товар');
});