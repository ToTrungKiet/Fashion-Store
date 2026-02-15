import mongoose from 'mongoose'; 

class Database { 
    async connect() {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/fashion-store`);
            console.log('Database đã được kết nối !');
        } catch (error) {
            console.error('Lỗi kết nối DB:', error);
            process.exit(1);
        }
    }
} 
export default new Database();
