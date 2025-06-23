const prisma = require('../src/db/db')

//Get order items
exports.getAllOrderItems = async(req, res) => {
    try {
        const orderItems = await prisma.orderItem.findMany();
        res.status(200).json(orderItems);
    } catch (err) {
        res.status(404).json({error: 'Failed to get order items'});
    }
}

//Creates order item for an existing order
exports.createorUpdateOrderItem = async(req, res) => {
    const orderId = Number(req.params.order_id);
    const {productId, quantity, price} = req.body;
    const itemTotal = quantity * price;
    try {
        const upsertOrderItem = await prisma.orderItem.upsert({
            where: {
                OrderProductUnique: {
                    productId: productId,
                    orderId: orderId
                }
            },
            update: {
                quantity: {
                    increment: quantity,
                },
            },
            create: {
                orderId: orderId,
                productId: productId,
                quantity: quantity,
                price: price,
            },
        });
        //Update order total price
        await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                totalPrice : {
                    increment: itemTotal
                }
            }
        })
        res.status(201).json(upsertOrderItem);
    } catch (err) {
        res.status(400).json({error: 'Failed to create order item'});
    }
}