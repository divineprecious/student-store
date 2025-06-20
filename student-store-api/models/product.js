const prisma = require('../src/db/db')

//Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (err) {
        res.status(500).json({error: 'Failed to get products'});
    }
} 

//Get product by ID
exports.getProductById = async (req, res) => {
    const id = Number(req.params.id);
    try {
       const product = await prisma.product.findUnique({where: {id}});
       res.json(product)
    } catch (err) {
        res.status(404).json({error: "Product not found!"});
    }
}

//Post product
exports.createProduct = async (req, res) => {
    const {name, description, price, image_url, category} = req.body;
    try {
        const newProduct = await prisma.product.create({data: {name, description, price, image_url, category},});
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({error: 'Failed to create product'});
    }
}

//Put product
exports.update = async (req, res) => {
    const id = Number(req.params.id);
    const {name, description, price, image_url, category} = req.body;
    try {
        const updatedProduct = await prisma.product.update({
            where: {id}, 
            data: {name, description, price, image_url, category},
        });
        res.json(updatedProduct);
    } catch (err) {
        res.status()
    }
}

//Delete product
exports.removeProduct = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma.product.delete({where : {id}})
        res.status(204).end()
    } catch (err) {
        res.status(404).json({error: 'Failed to delete product'});
    }
}

