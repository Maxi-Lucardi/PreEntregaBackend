import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const manager = new ProductManager();


router.get('/', async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});


router.get('/:pid', async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
});


router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (
    !title || !description || !code ||
    price === undefined || stock === undefined ||
    !category || !Array.isArray(thumbnails)
  ) {
    return res.status(400).json({ error: 'Faltan campos requeridos o thumbnails no es un array' });
  }

  try {
    const newProduct = await manager.addProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails
    });

    res.status(201).json(newProduct);
  } catch (error) {
  console.error("Error en addProduct:", error);
  res.status(500).json({ error: "Error al agregar el producto" });
}
});


router.put('/:pid', async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
  }
  res.json(updated);
});


router.delete('/:pid', async (req, res) => {
  await manager.deleteProduct(req.params.pid);
  res.json({ mensaje: 'Producto eliminado correctamente' });
});

export default router;
