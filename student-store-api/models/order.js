const prisma = require('../src/db/db')

//Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany();
        res.status(200).json(orders);
    } catch (error) {
        res.status(404).json({error: 'Failed to get orders'});
    }
}
//Get order by ID
exports.getOrderById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const order = await prisma.order.findUnique({
            where: {id},
            include: {orderItems: true}
        });
        res.status(200).json(order);
    } catch (err) {
        res.status(404).json({error: "Order not found"});
    }
}


//Get order total
exports.getOrderTotal = async(req, res) => {
    const id = Number(req.params.order_id);
    let total = 0;

    try {
        const orderItems = await prisma.orderItem.findMany({
            where: {orderId: id},
        })
        orderItems.forEach(orderItem => {
            total += (orderItem.quantity * orderItem.price);
        });
        res.status(200).json({total})
    } catch (err) {
        res.status(404).json({error: "Order not found"});
    }
}

//Post order
exports.createOrder = async (req, res) => {
    const {customerId, totalPrice, status, orderItems} = req.body;
    try {
        const newOrder = await prisma.order.create({
            data: {customerId, totalPrice, status, orderItems: {
                create: orderItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                })),
            }},
            include: {
                orderItems: true,
            },
        },
    );
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({error: "Failed to create order"});
    }
}

//Put order
exports.updateOrder = async (req, res) => {
    const id = Number(req.params.id);
    const {customer_id, total_price, status} = req.body;
    try {
        const updatedOrder = await prisma.order.update({
            where: {id},
            data: {customer_id, total_price, status}
        });
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(400).json({error: 'Failed to update order'});
    }
}

//Delete order
exports.removeOrder = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma.order.delete({where: {id}});
        res.status(204).end()
    } catch (err) {
        res.status(400).json({error: 'Failed to delete order'});
    }
}