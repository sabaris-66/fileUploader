// const multer = require("multer");
// const DatauriParser = require("datauri/parser");
// const path = require("path");
// const storage = multer.memoryStorage();
// const multerUploads = multer({ storage }).single("uploaded_file");
// const parser = new DatauriParser();

// const dataUri = (req, res) => {
//   return parser.format(
//     path.extname(req.file.originalname).toString(),
//     req.file.buffer
//   ).content;
// };

// // const dataUri = (req) =>
// //   dUri.format(path.extname(req.file.originalname.toString()), req.file.buffer);

// module.exports = { multerUploads, dataUri };
