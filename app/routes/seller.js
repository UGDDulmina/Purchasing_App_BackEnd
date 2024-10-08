const express = require('express');
const Seller = require('../models/seller');
const router = express.Router();
const jwt = require('jsonwebtoken');

const generateToken = (_id) => {

    return jwt.sign({_id}, process.env.SECRET,{expiresIn: '3d'})
}

router.post('/login', async (req, res)=>{

    try {
        const {email,password} = req.body;
        const seller = await Seller.login(email,password);
        
        const token = generateToken(seller._id)
        res.status(201).json({message:'Login successfull!', token});
    } catch (err){
        res.status(400).json({message: err.message})
    }

})


router.post('/signup',async (req, res)=> {

    try {
        const {firstName,lastName,description,telephoneNumbers,email,password} = req.body;
        const newSeller = await Seller.signup(firstName,lastName,description,telephoneNumbers,email,password);
        
        const token = generateToken(newSeller._id)
        res.status(201).json({message:'Signup successfull!', token});
    } catch (err){
        res.status(400).json({message: err.message})
    }
    
})

router.get('/', async (req , res) =>{
    try {
        const seller = await Seller.find();
        res.status(200).json(seller)
    } catch(err){
        res.status(400).json({message:err.message})
    }

})

router.get('/:id', async (req , res)=>{

    try {
        const seller = await Seller.findById(req.params.id );
        if (!seller) return res.status(404).json({ message: 'Seller not found!' });
        
         
        res.status(200).json(seller);


    } catch (err){
        res.status(500).json({ message: err.message });
    }
})

router.put('/update/:id', async (req, res)=>{
    try{
        const seller = await Seller.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        );

        if (!seller) return res.status(404).json({ message: 'Seller not found!' });
        
        res.status(200).json(seller);
        
    } catch(err){
        res.status(400).json({message: err.message});
    }
})

router.delete('/:id', async (req, res)=>{
    try{

        const seller = await Seller.findByIdAndDelete(req.params.id)
        if(!seller) return res.status(404).json({message: 'Seller not found'});
        res.status(200).json({ message: 'Seller deleted'});

    } catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = router;