const multer = require("multer");

const ApiError = require("../helpers/apiError.helpers");

const multerOptions = () => {
  const multerStorage = multer.diskStorage({});

  const multerFilter = (req, file, cb) => {
    file.mimetype.startsWith("image")
      ? cb(null, true)
      : cb(new ApiError("Only Allowed Image", 400), false);
  };

  return (upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  }));
};

const singleFileUpload = (fieldName) => multerOptions().single(fieldName);
const multiFileUpload = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

module.exports = { singleFileUpload, multiFileUpload };
