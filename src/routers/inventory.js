const express = require('express')
const Inventory = require('../models/inventory')
const auth = require('../middleware/auth')
const auth_customer = require('../middleware/auth_customer')
const router = new express.Router()

router.post('/inventory/new', auth, async (req, res) => {
    const inventory = new Inventory({
        ...req.body,
        owner: req.user._id
    })
    try {
        await inventory.save()
        res.status(201).send(inventory)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/inventory/merchant', auth , async (req, res) => {
    try {
        const inventory = await Inventory.findOne({ owner: req.user._id })
        if (!inventory) {
            return res.status(404).send()
        }
        console.log(inventory)
        res.send(inventory)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/inventory/customer', auth_customer , async (req, res) => {
    try {
        const inventory = await Inventory.findOne({ owner: req.query.merchantId })
        if (!inventory) {
            return res.status(404).send()
        }
        console.log(inventory)
        res.send(inventory)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/inventory/addCategory', auth, async (req, res) => {
    const { categoryName, owner } = req.body.category
    try {
        const inventory = await Inventory.findOne({ owner })
        console.log(inventory)
        if (!inventory) {
            return res.status(404).send()
        }
        inventory.categories.push({ categoryName, items: [],  })
        await inventory.save()
        res.send(inventory)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/inventory/deleteCategory', auth, async (req, res) => {
    const { _id } = req.body.category
    try {
        const inventory = await Inventory.findOne({ owner: req.user._id })
        if (!inventory) {
            return res.status(404).send()
        }
        inventory.categories.forEach((category, i) => {
            if (category._id.toString() === _id) {
                inventory.categories.splice(i, 1)
            }
        })
        await inventory.save()
        res.send(inventory)
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/inventory/addItem', auth, async (req, res) => {
    const { itemName, available, categoryId, sellingPrice } = req.body.item
    try {
        const inventory = await Inventory.findOne({ owner: req.user._id })
        if (!inventory) {
            return res.status(404).send()
        }
        inventory.categories.forEach(category => {
            if (category._id.toString() === categoryId) {
                category.items.push({ itemName, available, sellingPrice })
            }
        })
        await inventory.save()
        res.send(inventory)
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/inventory/updateItem', auth, async (req, res) => {
    const { _id, itemName, available, categoryId, sellingPrice } = req.body.item

    console.log(req.body.item.available)

    const updatedItem = {
        itemName, available, sellingPrice
    }

    try {
        const inventory = await Inventory.findOne({ owner: req.user._id })
        if (!inventory) {
            return res.status(404).send()
        }
        inventory.categories.forEach((category) => {
            if (category._id.toString() === categoryId) {
                category.items.forEach((item, i) => {
                    if (item._id.toString() === _id) {
                        category.items[i] = updatedItem
                    }
                })
            }
        })
        await inventory.save()
        res.send(inventory)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/inventory/deleteItem', auth, async (req, res) => {

    const { _id, categoryId } = req.body.item

    try {
        const inventory = await Inventory.findOne({ owner: req.user._id })
        if (!inventory) {
            return res.status(404).send({ error: 'Not found' })
        }
        inventory.categories.forEach((category) => {
            if (category._id.toString() === categoryId) {
                category.items.forEach((item, i) => {
                    console.log(item._id.toString())
                    console.log(_id)
                    if (item._id.toString() === _id) {
                        console.log('found')
                        category.items.splice(i, 1)
                    }
                })
            }
        })
        await inventory.save()
        res.send(inventory)
    } catch (e) {
        res.status(400).send()
    }
})

// router.delete('/items', async (req, res) => {
//     try {
//         const item = await Item.findOneAndDelete({ item: req.query.item })
//         if (!item) {
//             return res.status(404).send()
//         }
//         res.send(item)
//     } catch(e) {
//         res.status(500).send()
//     }
// })

module.exports = router