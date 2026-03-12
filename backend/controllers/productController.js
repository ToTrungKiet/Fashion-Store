import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js';
import orderModel from '../models/orderModel.js';


class ProductController {
  // Route thêm sản phẩm mới
  async addProduct(req, res) {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, sizeColorQuantity, colors } = req.body;

        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item != undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'})
                return result.secure_url
            })
        )

        const parsedSizes = JSON.parse(sizes);
        const parsedSizeColorQuantity = sizeColorQuantity ? JSON.parse(sizeColorQuantity) : {};
        const parsedColors = colors ? JSON.parse(colors) : ['Trắng', 'Đen', 'Xám'];
        
        const newProduct = {
          name,
          description,
          price: Number(price),
          category,
          subCategory,
          bestseller: bestseller === 'true' ? true : false,
          sizes: parsedSizes,
          colors: parsedColors,
          sizeColorQuantity: parsedSizeColorQuantity,
          image: imagesUrl
        }

        const product = new productModel(newProduct);
        await product.save();

        res.json({ success: true, message: 'Đã thêm 1 sản phẩm thành công !', product });

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route danh sách sản phẩm
  async listProducts(req, res) {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route xóa sản phẩm
  async removeProduct(req, res) {
    try {
      const deleted = await productModel.findByIdAndDelete(req.body.id);
      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm !" });
      }
      res.json({ success: true, message: 'Đã xóa sản phẩm thành công !', deletedProduct: deleted });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route 1 sản phẩm
  async singleProduct(req, res) {
    try {
      const { productId } = req.body;
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm !" });
      }
      res.json({ success: true, product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route cập nhật sản phẩm
  async updateProduct(req, res) {
    try {
      const { id, name, description, price, category, subCategory, sizes, bestseller, sizeColorQuantity, colors } = req.body;
      const product = await productModel.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm !' });
      }

      // Cập nhật trường cơ bản
      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = Number(price);
      if (category) product.category = category;
      if (subCategory) product.subCategory = subCategory;
      if (typeof bestseller !== 'undefined') product.bestseller = bestseller === 'true' ? true : false;
      
      if (sizes) {
        const parsedSizes = JSON.parse(sizes);
        product.sizes = parsedSizes;
      }

      if (sizeColorQuantity) {
        const parsedSizeColorQuantity = JSON.parse(sizeColorQuantity);
        product.sizeColorQuantity = parsedSizeColorQuantity;
      }

      if (colors) {
        const parsedColors = JSON.parse(colors);
        product.colors = parsedColors;
      }

      // Xử lý hình ảnh mới nếu có
      const image1 = req.files.image1?.[0];
      const image2 = req.files.image2?.[0];
      const image3 = req.files.image3?.[0];
      const image4 = req.files.image4?.[0];
      const images = [image1, image2, image3, image4].filter((item) => item != undefined);
      if (images.length) {
        let imagesUrl = await Promise.all(
          images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
            return result.secure_url;
          })
        );
        product.image = imagesUrl;
      }

      await product.save();
      res.json({ success: true, message: 'Cập nhật sản phẩm thành công !', product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route quản lý kho hàng - lấy danh sách tất cả sản phẩm với thông tin kho
  async getInventory(req, res) {
    try {
      const products = await productModel.find({});
      res.json({ success: true, products });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route cập nhật số lượng sản phẩm theo size-color
  async updateProductQuantity(req, res) {
    try {
      const { id, size, color, quantity } = req.body;
      if (quantity < 0) {
        return res.status(400).json({ success: false, message: 'Số lượng không được âm !' });
      }
      const product = await productModel.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm !' });
      }
      const key = `${size}-${color}`;
      product.sizeColorQuantity.set(key, Number(quantity));
      await product.save();
      res.json({ success: true, message: 'Cập nhật số lượng thành công !', product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route nhập thêm số lượng sản phẩm theo size-color
  async restockProduct(req, res) {
    try {
      const { id, size, color, addQuantity } = req.body;
      if (addQuantity <= 0) {
        return res.status(400).json({ success: false, message: 'Số lượng nhập phải lớn hơn 0 !' });
      }
      const product = await productModel.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm !' });
      }
      const key = `${size}-${color}`;
      const currentQuantity = product.sizeColorQuantity.get(key) || 0;
      product.sizeColorQuantity.set(key, currentQuantity + Number(addQuantity));
      await product.save();
      res.json({ success: true, message: 'Nhập hàng thành công !', product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route lấy sản phẩm bán chạy nhất
  async getBestSellers(req, res) {
    try {
      const orders = await orderModel.find({});
      const productSales = {};
      
      orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            if (item._id) {
              productSales[item._id] = (productSales[item._id] || 0) + (item.quantity || 1);
            }
          });
        }
      });

      const bestSellers = await productModel.find({});
      const productsWithSales = bestSellers.map(product => ({
        ...product.toObject(),
        sold: productSales[product._id] || 0
      })).sort((a, b) => b.sold - a.sold);

      res.json({ success: true, products: productsWithSales });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new ProductController();
