const express = require('express');
const app = express();
const multer = require('multer');
const processreq = require('./processreq');
const { checkusr, set } = require('./dbwrapper');
const ratelimits = require('./ratelimits');
let endpoints = {
    "GET": {},
    "POST": {},
    "PUT": {},
    "DELETE": {}
};
for (file of fs.readdirSync('./endpoints')) {
    const product = require(`./endpoints/${file}`);
    endpoints[product.method.upperCase()][file.replace('.js', '')] = product;
}

app.get('/:content', (req, res) => {
    if (ratelimits(req.ip)) {
        res.status(429).send("Too Many Requests, try again later, the amount of requests per second is 100, it resets every seconds, you are banned from the api for 10 minutes");
        return;
    }
    processreq(req, res, endpoints.GET);
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'db/modules/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
app.post('/publish', upload.single('file'), (req, res) => {
    if (ratelimits(req.ip)) {
        res.status(429).send("Too Many Requests, try again later, the amount of requests per minute second is 100, it resets every seconds, you are banned from the api for 10 minutes");
        return;
    }
    const body = JSON.parse(req.body);
    const module_info = {};
    module_info.name = body.name;
    module_info.author = body.AuthorName;
    if (!checkusr(module_info.author, body.password)) {
        res.status(401).send('Unauthorized (Password Incorrect)');
    }
    module_info.description = body.description;
    module_info.version = body.version;
    module_info.license = body.license;
    module_info.github_repo = body.github;
    module_info.website = body.website;
    module_info.file = req.file.filename;
    module_info.downloads = 0;
    module_info.verified = false;
    set(module_info.name, `module.exports = ${JSON.stringify(module_info, null, 4)}`);
});

app.listen(3000, () => {
<<<<<<< HEAD
    console.log('On!');
=======
    console.log("On!");
>>>>>>> d1a577a5f08245bef5f4e0d88c1bd426f791e8e5
});