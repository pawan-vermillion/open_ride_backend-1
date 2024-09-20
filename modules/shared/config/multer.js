const multer = require("multer");
const cloudinary = require("./cloudinary");
const path = require("path");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder;
      if (req.type === 'Partner') {
        if (file.fieldname === 'profileImage') {
          folder = 'uploads/partner/profile/';
        } else if (file.fieldname === 'exteriorImage') {
          folder = 'uploads/partner/car/exterior';
        } else if (file.fieldname === 'interiorImage') {
          folder = 'uploads/partner/car/interior';
        } else if (file.fieldname === 'rcPhoto') {
          folder = 'uploads/partner/car/rcBook';
        }
      } else if (req.type === 'User') {
        if (file.fieldname === 'profileImage') {
          folder = 'uploads/user/profile/';
        }
      } else if (file.fieldname === 'logoImage') {
        folder = 'uploads/admin/logo'
      }
      else {
        folder = 'uploads/other/profile';
      }

    return {
      folder: folder,
      format: path.extname(file.originalname).substring(1),
      public_id: Date.now().toString(),
      transformation: [{ quality: 'auto' }],
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      const errorMessage = `Only images are allowed (jpeg, jpg, png). Invalid file: ${file.originalname}`;
      cb(new Error(errorMessage));
    }
  }
})
const uploadLogo = multer({
  storage: new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
          folder: 'admin/logo',
          format: (req, file) => path.extname(file.originalname).substring(1),
          public_id: (req, file) => Date.now().toString(),
          transformation: [{ quality: 'auto' }],
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('logoImage');



const uploadToCloudinary = async (req, filePath, fieldname) => {
  try {

    let folder;

    if (req.type === 'Partner') {
      if (fieldname === 'profileImage') {
        folder = 'uploads/partner/profile/';
      } else if (fieldname === 'exteriorImage') {
        folder = 'uploads/partner/car/exterior';
      } else if (fieldname === 'interiorImage') {
        folder = 'uploads/partner/car/interior';
      } else if (fieldname === 'rcPhoto') {
        folder = 'uploads/partner/car/rcBook';
      }
    } else if (req.type === 'User') {
      if (fieldname === 'profileImage') {
        folder = 'uploads/user/profile/';
      }
    } else {
      folder = 'uploads/other/profile';
    }



    console.log('Uploading to Cloudinary:', { folder, filePath });

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: Date.now().toString(),
      transformation: [{ quality: 'auto' }],
    });

    console.log('Upload result:', result);
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(path, { folder }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    })
  } catch (error) {

    throw new Error('Error uploading to Cloudinary');
  }
};
const uploadMultiple = upload.fields([
  { name: 'exteriorImage', maxCount: 5 },
  { name: 'interiorImage', maxCount: 5 },
  { name: 'rcPhoto', maxCount: 1 },
  { name: 'logoImage', maxCount: 1 }
]);
module.exports = {
  upload,
  uploadToCloudinary,
  uploadMultiple,
  cloudinary,
  uploadLogo
};
