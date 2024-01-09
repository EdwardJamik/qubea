const {createCategory, categoryList, removeCategory, changeCategory, productList, changeProduct, createProduct,
    productSearch, productItemSearch, createOrder, settingList, removeProduct, updateSetting, ordersList,
    ordersHistoryList, declineOrder, acceptOrder, endOrder, updatePassword
} = require("../Controllers/manager.controller");
const router = require("express").Router();

router.get('/categoryList', categoryList)
router.post('/createCategory', createCategory)
router.post('/changeCategory', changeCategory)
router.post('/removeCategory', removeCategory)

router.post('/productList', productList)
router.post('/createProduct', createProduct)
router.post('/changeProduct', changeProduct)
router.post('/removeProduct', removeProduct)

router.get('/settingList', settingList)
router.post('/updateSetting', updateSetting)

router.post('/createOrder', createOrder)
router.get('/ordersList', ordersList)
router.get('/ordersHistoryList', ordersHistoryList)

router.post('/declineOrder', declineOrder)
router.post('/acceptOrder', acceptOrder)
router.post('/endOrder', endOrder)


router.post('/productSearch', productSearch)
router.post('/productItemSearch', productItemSearch)


// router.get('/reportList',reportList)
//
// router.get('/productList',productList)
// router.get('/productListBrand',productListBrand)
// router.post('/createBrand',createBrand)
// router.post('/updateBrand',updateBrand)
// router.post('/removeBrand',removeBrand)
//
//
// router.post('/brandEditInfo',brandEditInfo)
// router.get('/brandList',brandList)
//
// router.post('/insertProduct',insertProduct)
// router.post('/removeProduct',removeProduct)
// router.post('/uploadImageProduct',uploadImageProduct)



module.exports = router;