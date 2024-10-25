const multer = require("multer");
const cloudinary = require("./cloudinary");
const path = require("path");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const deleteOldImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'not found') {
      console.warn(`Image with public ID: ${publicId} not found for deletion.`);
    }
  } catch (error) {
    console.error('Failed to delete image:', error.message);
  }
};

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  }
});

const uploadLogo = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads/admin/logo',
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

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: Date.now().toString(),
      transformation: [{ quality: 'auto' }],
    });


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


const uploadAndDeleteOld = async (req, oldImageUrl) => {
  // First delete the old image
  await deleteOldImage(oldImageUrl);

  // Then upload the new image (upload logic from your existing code)
  upload(req, req.file, (error) => {
    if (error) {
      console.error('Error uploading file:', error);
      return;
    }
  });
};


const uploadMultiple = (req, res, next) => {
  upload.fields([
    { name: 'exteriorImage', maxCount: 5 },
    { name: 'interiorImage', maxCount: 5 },
    { name: 'rcPhoto', maxCount: 1 },
    { name: 'logoImage', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ message: err.message });
    }
    next();
  });
};



module.exports = {
  deleteOldImage,
  upload,
  uploadAndDeleteOld,
  uploadToCloudinary,
  uploadMultiple,
  cloudinary,
  uploadLogo
};
