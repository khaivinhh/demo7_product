var express = require('express');
var router = express.Router();
const productModel = require('../model/productModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

var upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', async function (req, res, next) {
    let prods = await productModel.find();
    return res.render('product/index', { products: prods });
});
router.get('/create', function (req, res, next) {
    return res.render('product/create');
});
router.post('/create', upload.single('image'), async function (req, res, next) {
    const file = req.file;
    let prod = new productModel({
        name: req.body.name,
        price: req.body.price,
        image: file.filename,
    });
    await prod.save();
    return res.redirect('/product');
});

router.get('/update/:id', async function (req, res, next) {
    let param = req.params;
    let pid = param.id;
    let prod = await productModel.findById(pid);
    return res.render('product/update', { product: prod });
});
router.post('/update', upload.single('image') , async function (req, res, next) {

    await productModel.updateOne({ _id: req.body.id }, { $set: { name: req.body.name, price: req.body.price, image: req.file.filename } });
    return res.redirect('/product');
});

router.get('/delete/:id', async function (req, res, next) {
    await productModel.deleteOne({ _id: req.params.id });
    return res.redirect('/product');
});
router.post('/find_by_name', async function (req, res, next) {
    let prods = await productModel.find({ name: { $regex: req.body.name, $options: 'i' } });
    return res.render('product/index',{products:prods});
});
module.exports = router;

