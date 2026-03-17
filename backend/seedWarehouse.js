import productModel from './models/productModel.js';
import connectDB from './config/mongodb.js';

const seedWarehouse = async () => {
  try {
    await connectDB();

    const products = await productModel.find({});
    console.log(`Found ${products.length} products to seed`);

    for (const product of products) {
      if (!product.sizeColorQuantity) {
        product.sizeColorQuantity = new Map();
      }

      // Generate random quantities for each size-color combination
      product.sizes.forEach(size => {
        product.colors.forEach(color => {
          const key = `${size}-${color}`;
          const randomQuantity = Math.floor(Math.random() * 100) + 10; // Random between 10-110
          product.sizeColorQuantity.set(key, randomQuantity);
        });
      });

      await product.save();
      console.log(`✓ Seeded ${product.name}`);
    }

    console.log('\nWarehouse seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding warehouse:', error);
    process.exit(1);
  }
};

seedWarehouse();
