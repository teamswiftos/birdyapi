const express = require('express');
const app = express();
const multer = require('multer');
const processreq = require('./processreq');
const { checkusr, set } = require('./dbwrapper');
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
    const uploadedFileName = req.file.filename;
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
    set(module_info.name, `module.exports = ${JSON.stringify(module_info, null, 4)}`);
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});