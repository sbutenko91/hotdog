const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Hotdog model
require('../models/Hotdog');
require('../models/User');
const Hotdog = mongoose.model('hotdogs');
const User = mongoose.model('users');

// Hotdog page
router.get('/',ensureAuthenticated, (req, res) => {
    Hotdog.find({
    })
    .sort({date:'desc'})
    .then(hotdogs => {
        res.render('hotdogs/index', {
            hotdogs: hotdogs
        }); 
    })
});

// Add Hotdog Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('hotdogs/add');
})

// Edit Hotdog Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Hotdog.findOne({
        _id: req.params.id
    })
    .then(hotdog => {
        res.render('hotdogs/edit', {
            hotdog: hotdog
        });
    });
});

// Process form
router.post('/', (req, res) =>{
    let errors = [];

    if(!req.body.type){
        errors.push({text:'Please add a hotdog type'})
    }

    if(errors.length > 0){
        res.render('hotdogs/add', {
            errors: errors,
            type: req.body.type,
            imageUrl: req.body.image
        })
    } else {
        var ingarr = []; 
        ingarr = req.body.ingredients.split(/[ ,]+/);
        const newHotdog = {
            type: req.body.type,
            imageUrl: req.body.image,
        }
        newHotdog.ingredients = ingarr;
        new Hotdog(newHotdog)
        .save()
        .then(hotdog => {
            req.flash('success_msg', 'Hotdog has been added')
            res.redirect('/hotdogs');
        })
    }

})

// Edit form process
router.put('/:id', (req, res) => {
    Hotdog.findOne({
        _id: req.params.id
    })
    .then(hotdog => {
        //new value
        hotdog.type = req.body.type;
        hotdog.imageUrl = req.body.image;
        var ingarr = []; 
        ingarr = req.body.ingredients.split(/[ ,]+/);
        hotdog.ingredients = ingarr;
        hotdog.save()
        .then(hotdog => {
            req.flash('success_msg', 'Hotdog has been updated')
            res.redirect('/hotdogs');
        });
    });
});

// Delete Hotdog
router.delete('/:id', (req, res) => {
    Hotdog.deleteOne({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Hotdog has been removed')
        res.redirect('/hotdogs');

    })
})

module.exports = router;