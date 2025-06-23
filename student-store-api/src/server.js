const express = require('express')
const app = express()
const cors = require("cors");
const productController = require('../models/product')
const orderController = require('../models/order')
const orderItemController = require('../models/orderItem')

const corsOption = {
    origin: "http://localhost:5173"
};

app.use(cors(corsOption));
app.use(express.json());

const PORT = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//Order endpoint routes
app.get('/orders', orderController.getAllOrders);

app.get('/orders/:id', orderController.getOrderById);

app.get('/order-items', orderItemController.getAllOrderItems);

app.get('/orders/:order_id/total', orderController.getOrderTotal);

app.post('/orders', orderController.createOrder);

app.post('/orders/:order_id/items', orderItemController.createorUpdateOrderItem);

app.put('/orders/:id', orderController.updateOrder);

app.delete('/orders/:id', orderController.removeOrder);

//Product endpoint routes
app.get('/products', productController.getAllProducts);

app.get('/products/:id', productController.getProductById);

app.post('/products', productController.createProduct);

app.put('/products/:id', productController.updateProduct);

app.delete('/products/:id', productController.removeProduct);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`))
