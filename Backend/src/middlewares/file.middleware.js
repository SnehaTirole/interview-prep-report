const multer = require("multer");

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype !== "application/pdf") {
            return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
        }
        callback(null, true);
    }
});

function validatePdfSignature(req, res, next) {
    if (!req.file) {
        return res.status(400).json({ message: "A PDF resume is required." });
    }

    if (req.file.mimetype !== "application/pdf" || req.file.buffer.subarray(0, 5).toString() !== "%PDF-") {
        return res.status(400).json({ message: "The uploaded resume must be a valid PDF file." });
    }

    next();
}

module.exports = upload;
module.exports.validatePdfSignature = validatePdfSignature;
