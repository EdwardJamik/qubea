const Category = require('../Models/category.model')
const Order = require('../Models/order.model')
const Setting = require('../Models/settings.model')
const Product = require('../Models/product.model')
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const bot = require("../bot");
const jsonData = require("../errorMessage.json");

function getMessageByErrorCode(errorCode) {
    const result = jsonData.find(item => item.errorCode === errorCode);
    return result ? result.message : " ";
}

module.exports.categoryList = async (req, res, next) => {
    try {
        const category = await Category.find({})

        if(category.length){
            return res.json({success:true,category:category})
        } else{
            return res.json({success:false,category:[]})
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.createCategory = async (req, res, next) => {
    try {

        const {title,image} = req.body

        const listCategory = await Category.find({})

        if(listCategory.length <= 5){
            const createProductCategory = await Category.insertMany({title,image})

            if(createProductCategory[0]?._id){
                return res.json({success:true,message: getMessageByErrorCode(0)})
            } else{
                return res.json({success:false,message:getMessageByErrorCode(1)})
            }
        } else{
            return res.json({success:false,message:getMessageByErrorCode(2)})
        }


    } catch (e){
        console.error(e)
    }
}

module.exports.changeCategory = async (req, res, next) => {
    try {

        const {_id, title, image} = req.body

        const updateProductCategory = await Category.updateOne({_id:_id},{title,image})

        if(updateProductCategory){
            return res.json({success:true,message:getMessageByErrorCode(3)})
        } else{
            return res.json({success:false,message:getMessageByErrorCode(4)})
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.removeCategory = async (req, res, next) => {
    try {

        const {_id} = req.body

        const categoryRemoved = await Category.deleteOne({_id})

        if(categoryRemoved){
            return res.json({success:true,message:getMessageByErrorCode(5)})
        } else{
            return res.json({success:false,message:getMessageByErrorCode(6)})
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.removeProduct = async (req, res, next) => {
    try {

        const {_id} = req.body

        const categoryRemoved = await Product.deleteOne({_id})

        if(categoryRemoved){
            return res.json({success:true,message:getMessageByErrorCode(7)})
        } else{
            return res.json({success:false,message:getMessageByErrorCode(8)})
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.productList = async (req, res, next) => {
    try {
        const {_id} = req.body

        const product = await Product.find({category:_id}).populate('category').exec();

        if(product.length){
            return res.json({success:true,product:product})
        } else{
            return res.json({success:false,product:[]})
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.settingList = async (req, res, next) => {
    try {
        const setting = await Setting.find({})

        if(setting.length){
            return res.json(setting)
        } else{
            return res.json(false)
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.ordersList = async (req, res, next) => {
    try {

        const order = await Order.find({success:false,cancel:false})

        if(order.length){
            return res.json(order)
        } else{
            return res.json(false)
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.ordersHistoryList = async (req, res, next) => {
    try {

        const order = await Order.find({
            $or: [
                { success: true, cancel: false },
                { cancel: true, success: false }
            ]
        }).sort({ orderNumber: -1, createdAt: -1 });
        if(order.length){
            return res.json(order)
        } else{
            return res.json(false)
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.updateSetting = async (req, res, next) => {
    try {

        const {setting} = req.body

        for (const settings of setting) {
            await Setting.updateOne({ _id: settings._id }, { $set: settings });
        }

            return res.json({success:true,message:getMessageByErrorCode(9)})
    } catch (e){
        console.error(e)
    }
}

module.exports.declineOrder = async (req, res, next) => {
    try {

        const {_id} = req.body

        const {message_id} = await Order.findOne({_id},{message_id:1});

        await bot.telegram.editMessageReplyMarkup('-1002100671707',message_id,0,{ inline_keyboard: [
                [{ text: '❌', callback_data:`${_id}` }]
            ]})

        await Order.updateOne({ _id }, {cancel:true});

        return res.json({success:true,message:getMessageByErrorCode(10)})
    } catch (e){
        console.error(e)
    }
}

module.exports.acceptOrder = async (req, res, next) => {
    try {

        const {_id} = req.body

        const {message_id} = await Order.findOne({_id},{message_id:1});

        await bot.telegram.editMessageReplyMarkup('-1002100671707',message_id,0,{ inline_keyboard: [
                [{ text: 'End Order', callback_data:`end-${_id}` }]
            ]})

        await Order.updateOne({ _id }, {accepting:true});

        return res.json({success:true,message:getMessageByErrorCode(11)})
    } catch (e){
        console.error(e)
    }
}

module.exports.endOrder = async (req, res, next) => {
    try {

        const {_id} = req.body

        const {message_id} = await Order.findOne({_id},{message_id:1});

        await bot.telegram.editMessageReplyMarkup('-1002100671707',message_id,0,{ inline_keyboard: [
                [{ text: '✅', callback_data:`${_id}` }]
            ]})
        await Order.updateOne({ _id }, {waiting:true,success:true});

        return res.json({success:true,message:getMessageByErrorCode(12)})
    } catch (e){
        console.error(e)
    }
}

module.exports.createProduct = async (req, res, next) => {
    try {
        const {title, description, options, image, category} = req.body

        const listCategory = await Product.find({category:category})

        if(listCategory.length <= 5) {
            const createProduct = await Product.insertMany({title, description, options, image, category})

            if (createProduct[0]?._id) {
                return res.json({success: true, message: getMessageByErrorCode(13)})
            } else {
                return res.json({success: false, message: getMessageByErrorCode(14)})
            }
        }else{
            return res.json({success: false, message: getMessageByErrorCode(15)})
        }

    } catch (e){
        console.error(e)
    }
}

module.exports.changeProduct = async (req, res, next) => {
    try {

        const {_id, title, description, options, image} = req.body


        const updateProductCategory = await Product.updateOne({_id:_id},{title,description,options,image})

        if(updateProductCategory){
            return res.json({success:true,message:getMessageByErrorCode(16)})
        } else{
            return res.json({success:false,message:getMessageByErrorCode(17)})
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.productSearch = async (req, res, next) => {
    try {
        const {id} = req.body

        const product = await Product.find({category:id}).populate('category').exec();
        const {title} = await Category.findOne({_id:id},{title:1,_id:0});

        if(product.length){
            return res.json({success:true,product:product, title})
        } else{
            return res.json({success:false,product:[], title})
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.productItemSearch = async (req, res, next) => {
    try {
        const {id} = req.body

        const product = await Product.findOne({_id:id}).populate('category').exec();
        const {title} = await Category.findOne({_id:product?.category},{title:1,_id:0});

        if(product){
            return res.json({success:true,product:product, title:`${title} - ${product?.title}`})
        } else{
            return res.json({success:false,product:[], title:`${title} - ${product?.title}`})
        }
    } catch (e){
        console.error(e)
    }
}

module.exports.createOrder = async (req, res, next) => {
    try {
        const {table, option, product, subscribeId} = req.body

        const latestOrder = await Order.findOne({subscribeId:subscribeId}, {_id: 0, createdAt:1,orderNumber: 1}).sort({orderNumber:-1, createdAt: -1 });

        const latestOrderNumber = await Order.findOne({}, {_id: 0, createdAt:1,orderNumber: 1}).sort({orderNumber:-1, createdAt: -1 });


        dayjs.extend(utc);
        dayjs.extend(timezone);

        const originalDateTime = dayjs(latestOrder?.createdAt);

        const targetTimeZone = 'Europe/London';
        let convertedDateTime = originalDateTime.tz(targetTimeZone);
        convertedDateTime = convertedDateTime.$d.setMinutes(((convertedDateTime.$d.getMinutes())+10))

        let currentDate = dayjs(new Date())
        const convertedCurrentDateTime = currentDate.tz(targetTimeZone);

        if(convertedDateTime <= convertedCurrentDateTime.$d.getTime() || latestOrder === null){
            const orderNumber  = latestOrderNumber?.orderNumber > 0 ? Number(latestOrderNumber?.orderNumber)+1:1;
            const createOrder = await Order.insertMany({orderNumber, table, option, product, subscribeId, createdAt:new Date()})

            if(createOrder[0]?._id){
                const options = option.map((item,index)=>{
                    return `${item.option} - ${item.count}`
                })
                const {message_id} = await bot.telegram.sendMessage(
                    '-1002100671707',
                    `<b>Order #${orderNumber}</b>\n\n<b>Table:</b> ${table}\n\n<b>Product:</b>  ${product}\n<b>Ingredient:</b>\n${options}`,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'Accept Order', callback_data:`accept-${createOrder[0]?._id}` }, { text: 'Cancel', callback_data:`cancel-${createOrder[0]?._id}` }]
                            ]
                        }
                    }
                );

                const updateOrder = await Order.updateOne({_id:createOrder[0]?._id},{message_id:message_id})

                return res.json({success:true})
            } else{
                return res.json({success:false})
            }
        } else {
            const lastTime= convertedDateTime - convertedCurrentDateTime.$d.getTime()
            const timestampInMinutes = Math.floor(lastTime / (1000 * 60));
            const timestampInSecond = Math.floor(lastTime / (1000));



            if(timestampInMinutes){
                const eMessage = getMessageByErrorCode(18)
                const modifiedMessage = eMessage.replace("{{time}}", timestampInMinutes);

                return res.json({success:false, message:modifiedMessage})
            } else{
                const eMessage = getMessageByErrorCode(19)
                const modifiedMessage = eMessage.replace("{{time}}", timestampInSecond);
                return res.json({success:false, message:modifiedMessage})
            }
        }

    } catch (e){
        console.error(e)
    }
}

