const multer = require("multer");
const cloudinary = require("./cloudinary");
const path = require("path");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { log } = require("console");

const deleteOldImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'not found') {
      console.warn(`Image with public ID: ${publicId} not found for deletion.`);
    }
    return result;
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
      }else if (file.fieldname === 'driverImage') {  
        folder = 'uploads/partner/driverimage/';
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
    // Validate filePath
    if (!filePath) {
      throw new Error('Invalid file path: filePath is undefined or empty');
    }

    let folder;

    if (req.type === 'Partner') {
      if (fieldname === 'profileImage') {
        folder = 'uploads/partner/profile/';
      } else if (fieldname === 'exteriorImage') {
        folder = 'uploads/partner/car/exterior/';
      } else if (fieldname === 'interiorImage') {
        folder = 'uploads/partner/car/interior/';
      } else if (fieldname === 'rcPhoto') {
        folder = 'uploads/partner/car/rcBook/';
      }else if (fieldname === 'driverImage') {  
        folder = 'uploads/partner/driverimage/';
      }else {
        throw new Error('Invalid fieldname for Partner');
      }
    } else if (req.type === 'User') {
      if (fieldname === 'profileImage') {
        folder = 'uploads/user/profile/';
      } else {
        throw new Error('Invalid fieldname for User');
      }
    } else if (fieldname === 'logoImage') {
      folder = 'uploads/admin/logo/';
    } else {
      throw new Error('Invalid request type or fieldname');
    }

    const randomFiveDigit = Math.floor(10000 + Math.random() * 90000);
    const currentTime = Date.now();
    const uniquePublicId = `${randomFiveDigit}-${currentTime}`;


    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      public_id: uniquePublicId,
      transformation: [{ quality: 'auto' }],
    });


    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Error uploading file to Cloudinary');
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
    { name: 'logoImage', maxCount: 1 },
    { name: 'driverImage', maxCount: 1 },
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err.message);
      return res.status(500).json({ message: err.message });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ message: 'Unexpected error during file upload.' });
    }
    
    // if (!req.files || !req.files.exteriorImage || !req.files.interiorImage || !req.files.rcPhoto) {
    //   return res.status(400).json({ message: 'Missing required files.' });
    // }
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
