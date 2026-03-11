import mongoose from 'mongoose';
import productModel from './models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Áo Thun Cotton Nam',
    description: 'Áo thun cotton nguyên chất, thoáng mát, phù hợp mặc hàng ngày',
    price: 150000,
    image: [
      'https://via.placeholder.com/300?text=Ao+Thun+1',
      'https://via.placeholder.com/300?text=Ao+Thun+2'
    ],
    category: 'Áo',
    subCategory: 'Áo Thun',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Trắng', 'Đen', 'Xám', 'Xanh', 'Đỏ'],
    bestseller: true
  },
  {
    name: 'Quần Jean Nam Slim Fit',
    description: 'Quần jean cao cấp với kiểu dáng slim fit, thoải mái và phong cách',
    price: 450000,
    image: [
      'https://via.placeholder.com/300?text=Quan+Jean+1',
      'https://via.placeholder.com/300?text=Quan+Jean+2'
    ],
    category: 'Quần',
    subCategory: 'Quần Jean',
    sizes: ['28', '29', '30', '31', '32', '33', '34'],
    colors: ['Xanh Đậm', 'Xanh Nhạt', 'Đen', 'Xám'],
    bestseller: true
  },
  {
    name: 'Áo Sơ Mi Trắng Nam',
    description: 'Áo sơ mi trắng lịch sự, thích hợp cho công sở và các dịp trang trọng',
    price: 350000,
    image: [
      'https://via.placeholder.com/300?text=Ao+So+Mi+1',
      'https://via.placeholder.com/300?text=Ao+So+Mi+2'
    ],
    category: 'Áo',
    subCategory: 'Áo Sơ Mi',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Trắng', 'Xanh', 'Hồng', 'Vàng'],
    bestseller: false
  },
  {
    name: 'Giày Thể Thao Sneaker',
    description: 'Giày sneaker chất lượng cao, êm chân, phù hợp mặc hàng ngày',
    price: 650000,
    image: [
      'https://via.placeholder.com/300?text=Giay+Sneaker+1',
      'https://via.placeholder.com/300?text=Giay+Sneaker+2'
    ],
    category: 'Giày',
    subCategory: 'Sneaker',
    sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43'],
    colors: ['Trắng', 'Đen', 'Xám', 'Xanh'],
    bestseller: true
  },
  {
    name: 'Áo Khoác Bomber Đen',
    description: 'Áo khoác bomber thời trang, ấm áp, phù hợp mùa lạnh',
    price: 550000,
    image: [
      'https://via.placeholder.com/300?text=Ao+Khoac+1',
      'https://via.placeholder.com/300?text=Ao+Khoac+2'
    ],
    category: 'Áo Khoác',
    subCategory: 'Bomber',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Đen', 'Xanh Hải Quân', 'Đỏ', 'Xám'],
    bestseller: false
  },
  {
    name: 'Quần Short Nam',
    description: 'Quần short dáng vừa, thoáng mát, thích hợp mặc hè',
    price: 200000,
    image: [
      'https://via.placeholder.com/300?text=Quan+Short+1',
      'https://via.placeholder.com/300?text=Quan+Short+2'
    ],
    category: 'Quần',
    subCategory: 'Short',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Đen', 'Xám', 'Xanh', 'Trắng'],
    bestseller: true
  },
  {
    name: 'Áo Len Cổ Lọ Nam',
    description: 'Áo len ấm áp, thoải mái, phù hợp mùa đông',
    price: 400000,
    image: [
      'https://via.placeholder.com/300?text=Ao+Len+1',
      'https://via.placeholder.com/300?text=Ao+Len+2'
    ],
    category: 'Áo',
    subCategory: 'Áo Len',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Đen', 'Xám', 'Kem', 'Nâu'],
    bestseller: false
  },
  {
    name: 'Mũ Snapback Nam',
    description: 'Mũ snapback thời trang, điều chỉnh được, phù hợp mặc hàng ngày',
    price: 120000,
    image: [
      'https://via.placeholder.com/300?text=Mu+Snapback+1',
      'https://via.placeholder.com/300?text=Mu+Snapback+2'
    ],
    category: 'Phụ Kiện',
    subCategory: 'Mũ',
    sizes: ['One Size'],
    colors: ['Đen', 'Trắng', 'Xám', 'Xanh'],
    bestseller: true
  }
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await productModel.deleteMany({});
    console.log('Cleared existing products');

    const createdProducts = await productModel.insertMany(sampleProducts);
    console.log(`\n✓ Created ${createdProducts.length} sample products:`);
    
    createdProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name}`);
    });

    console.log('\nProducts seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
