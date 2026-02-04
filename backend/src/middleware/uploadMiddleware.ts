import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads");
//   },
//   filename: function (req, file, cb) {
//     const fileSpaceCheck = file.originalname.replace(/ /g, "_");
//     cb(null, file.fieldname + "-" + Date.now() + fileSpaceCheck);
//   },
// });

const storage = multer.memoryStorage();

const checkImageFilter = (req: any, file: { mimetype: string }, cb: any) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only images or PDFs"));
  }
};
export const uploadImageMiddleWare = multer({
  storage: storage,
  fileFilter: checkImageFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});
