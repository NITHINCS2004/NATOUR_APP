const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

//multer.diskStorage() is a built-in function in Multer that tells Multer to:Store uploaded files directly on your disk (i.e., in a folder on your computer)
/*
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
}); 
*/
//Below multer.diskStorage() ===  This tells Multer (a file upload library) to store uploaded files in memory (RAM) instead of saving them directly to disk.
const multerStorage = multer.memoryStorage();
//The multerFilter function is used to allow only image files to be uploaded and reject all other file types (like PDFs, videos, etc.).
const multerFilter = (req,file,cb) => {
   if(file.mimetype.startsWith('image')){
    cb(null,true);
   }
   else{
    cb(new AppError('Not an image ! please upload only images.',404),false);

   }
}


const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
});
exports.uploadUserPhoto = upload.single('photo');


exports.resizeUserPhoto = catchAsync(async(req,res,next) => {
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  if(!req.file) return next();
  //req.file.buffer contains the raw data (bytes) of the uploaded image file.Instead, the file is temporarily stored in memory (RAM) as a binary buffer.
  await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`);
  next();
});





const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};


exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  //console.log(req.file);
  //console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  //if (req.file) filteredBody.photo = `img/users/${req.file.filename}`;
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  console.log('Updating user with:', filteredBody);

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});


exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
