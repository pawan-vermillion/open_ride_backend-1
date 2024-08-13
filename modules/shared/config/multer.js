const multer = require("multer");
const path = require("path");
const cloudinary = require("./cloudinary");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;    
    if (req.type === 'Partner') {
      if (file.fieldname === 'profileImage') {
        folder = 'uploads/partner/profile/';
      } else if (file.fieldname === 'exteriorImage') {
        folder = 'uploads/partner/car/exterior';
      }
      else if (file.fieldname === 'interiorImage') {
        folder = 'uploads/partner/car/interior';
      }
      else if (file.fieldname === 'rcPhoto') {
        folder = 'uploads/partner/car/rcBook';
      }
    } else if (req.type === 'User') {
      if (file.fieldname === 'profileImage') {
        folder = 'uploads/user/profile/';
      }
    } else {
      folder = 'uploads/other/';
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
  
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
});

const uploadToCloudinary = async (req, filePath, fieldname) => {
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
    folder = 'uploads/other/';
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: folder,
    public_id: Date.now().toString(),
    transformation: [{ quality: 'auto' }]
  });

  return result.secure_url;
};


module.exports = {
  upload,
  uploadToCloudinary
};
