const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv').config();


const multer  = require('multer')
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const app = express();

// var corsOptions1 = {
//     origin: "http://localhost:5173"
// };

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://gamescookie.com',
    'https://www.gamescookie.com',
    'https://play1.gamescookie.com',
    'https://play2.gamescookie.com',
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);

//     const allowed = /^https:\/\/([a-z0-9-]+\.)?gamescookie\.com$/;

//     if (allowed.test(origin)) {
//       return callback(null, true);
//     }

//     console.error('CORS BLOCKED:', origin);
//     callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true
// }));



// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//.........
const db = require("./models");

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Games Cookie." });
});

// anything beginning with "/api" will go into this
app.use('/api', require('./routes'));


//..........................................................................
//..........................................................................
//..........................................................................

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dynamicFolder = req.params.folderName;
        const uploadPath = `./uploads/${dynamicFolder}`;
        // Create the directory if it doesn't exist
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            cb(null, uploadPath); // Pass the dynamic path to the callback
        });
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
}); 


// const upload = multer({ storage: storage });
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(file.originalname)) {
        return cb(new Error('Please upload files with extensions .jpeg/.jpg/.png/.gif only.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

// File filter to accept only PDFs
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Configure multer
const uploadPDF = multer({ 
  storage: storage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});



app.post('/file-upload/:folderName', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({
            message: "Please upload files with extensions .jpeg/.jpg/.png/.gif only."
        });
    }
    return res.status(200).json({
        message: "Image uploaded successfully!",
        filename: req.file.filename,
        path: req.file.path,
    });
});

app.post('/upload-pdf/:folderName', uploadPDF.single('pdf'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // File upload successful
    return res.status(200).json({
        message: "PDF uploaded successfully!",
        filename: req.file.filename,
        path: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.use('/uploads', express.static('uploads'));


//..........................................................................
//..........................................................................
app.post('/delete-image', async (req, res) => {
    const { fileName } = req.body;

    await fsPromises.unlink(fileName);

    return res.status(200).json({
        message: "Image deleted successfully!",
    });

});
//..........................................................................
//..........................................................................

// set port, listen for requests
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});