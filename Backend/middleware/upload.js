const multer = require('multer')

const storage = multer.memoryStorage(); // or diskStorage
const upload = multer({ storage });

module.exports = upload