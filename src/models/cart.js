const mongoose = require("mongoose");

// var cartElement = new mongoose.Schema({
//     item_ID: { type: Schema.Types.ObjectId, required: true },
//     quantity: { type: Number, min: 0 },
// });

//this schema was used for testing
// var cartElement = new mongoose.Schema({
//     item_id: { type: String, required: true, unique: true },
//     quantity: {
//         type: Number,
//         min: 0,
//         required: true,
//         default: 0,
//     },
//     cost: {
//         type: Number,
//         required: true,
//         min: 0,
//     },
// });

// _id should be customer_id + merchant_id
const cartSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        itemName: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true
        },
        sellingPrice: {
            type: String,
            required: true
        }
    }],
    totalCost: {
        type: Number,
        default: 0,
        required: true
    }
});

var Cart = mongoose.model("Carts", cartSchema);

module.exports = Cart

//checks if the item quantity is zero or not
// var isQuantityZero = async (element, cart) => {
//     try {
//         if (element.quantity <= 0) {
//             cart.items.pull(element);
//             await items.deleteOne({ item_id: element.item_id });
//             cart.numberItems -= 1;
//             await cart.save();
//         } else await element.save();
//     } catch (e) {
//         return new Promise("", e);
//     }

//     if (element.quantity <= 0) {
//         cart.items.pull(element);
//     }
// };

//updates item based on the quantity specified
// cart.methods.updateItem = async (element, cart) => {
//     try {
//         var itemFound = await items.findOne({ item_id: element.item_id });
//         if (itemFound) {
//             itemFound.quantity += element.quantity;
//             await itemFound.save();
//         } else {
//             cart.addItem(element, cart);
//         }
//     } catch (e) {
//         return new Promise((resolve, resject) => {
//             reject(Error("invalid Parameters"));
//         });
//     }
// };

// cart.methods.reduceItem = async (element, cart) => {
//     try {
//         var item = await items.findOne({ item_id: element.item_id });
//         if (item) {
//             item.quantity -= element.quantity;
//             await item.save();
//             await isQuantityZero(item, cart);
//         } else {
//             throw new Error();
//         }
//     } catch (e) {
//         return new Promise((resolve, reject) => {
//             reject(new Error("Invalid Parameters"));
//         });
//     }
// };

// //when a new item is added to a cart
// cart.methods.addItem = async (item, cart) => {
//     try {
//         console.log("curent cart, ", cart._id);
//         console.log("to be added ", item);
//         var itemToAdd = await items.findOne({ item_id: item.item_id });
//         console.log("check1");
//         if (itemToAdd) {
//             console.log("check2");
//             itemToAdd.quantity += item.quantity;
//             console.log("check2.1");
//             await itemToAdd.save();
//         } else {
//             console.log("check 3");
//             var newItem = new items({ item_id: item.item_id, quantity: item.quantity, cost: item.cost });
//             await newItem.save();
//             console.log("item saved succefully");
//             cart.numberItems += 1;
//             cart.items.push(newItem);
//             // console.log(cart);
//             await cart.save();
//         }
//     } catch (e) {
//         console.log("error recieved: ", e);
//         return new Promise((resolve, reject) => {
//             reject(Error("Invalid Parameters"));
//         });
//     }
// };

// cart.methods.emptyIt = async (cart) => {
//     try {
//         var items_array = cart.items;
//         for (var i in items_array) {
//             await items.deleteOne({ _id: items_array[i] });
//         }
//         await carts.deleteOne(cart);
//     } catch (e) {
//         return new Promise((resolve, reject) => {
//             reject(Error("invalid Parameters"));
//         });
//     }
// };