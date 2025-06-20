const express = require('express')
const app = express()
const productController = require('../models/product')
app.use(express.json());

const PORT = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/products', productController.getAllProducts);

app.get('/products/:id', productController.getProductById);

app.post('/products', productController.createProduct);

app.put('/products/:id', productController.update);

app.delete('products/:id', productController.removeProduct);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`))
