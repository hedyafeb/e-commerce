const User = require('../models/user.js')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class UserController {
    static register(req, res) {
        const hash = crypto.createHmac('sha256', process.env.HASH_SECRET) 
        .update(req.body.password)
        .digest('hex')

        console.log(hash);
        
        User.create({
            email: req.body.email,
            password: hash
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static login(req, res) {
        const hash = crypto.createHmac('sha256', process.env.HASH_SECRET) 
        .update(req.body.password)
        .digest('hex')

        User.findOne({email: req.body.email, password: hash}) 
        .then(user => {
            if (!user) {
                res.status(400).json({ message: 'wrong username or password'}) 
            }
            else { 
                const accessToken = jwt.sign({ 
                    id: user._id,
                    name: user.name, 
                    email: user.email
                }, process.env.JWT_SECRET)
                res.status(200).json({ message: 'user exist', accessToken })
            }

        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static readAllUsers(req, res) { 
        User.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    } 

    static delete(req, res) { 
        User.deleteOne(
            { _id: req.params.userID}
        )
        .then( data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static update(req, res) { 
        const hash = crypto.createHmac('sha256', process.env.HASH_SECRET) 
        .update(req.body.password) 
        .digest('hex')

        User.updateOne({ _id: req.params.userID }, { 
            name: req.body.name,
            email: req.body.email,
            password: hash, 
            address: req.body.address,
            phoneNumber: req.body.phoneNumber
        })
        .then( data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static updateRole(req, res) { 
        User.updateOne({ _id: req.params.userID }, { 
            role: req.body.role
        })
        .then( data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}

module.exports = UserController