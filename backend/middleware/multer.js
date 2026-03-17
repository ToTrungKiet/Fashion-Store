import multer from 'multer';

class UploadMiddleware {
  constructor() {
    this.storage = multer.diskStorage({
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
    });

    this.upload = multer({ storage: this.storage });
  }
  fields(fields) {
    return this.upload.fields(fields);
  }
}

export default new UploadMiddleware();