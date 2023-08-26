const express = require('express');
const router = express.Router();
const Db = require('../models/dbModels');

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json' ,
  };

// @routes GET api/posts
// @dest Get An post

router.get('/', async (req, res) => {
    try {
        const posts = await Db.findAll()
        if (!posts) throw Error('No Items');
        res.status(200).json(posts);
    } catch (err) {
        res.status(400).json({ msg: err })
    }
})

// @routes GET api/posts:id
// @dest Get An post
router.get('/:id', async (req, res) => {
    try {
        const post = await Db.findById(req.params.id);
        if (!post) throw Error('No Items');
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ msg: err })
    }
})

// @routes POST api/posts
// @dest Create An post
router.post('/', async (req, res) => {
    try {
        const post = await Db.create(req.body);
        if (!post) throw Error('Something has wrong while saving to database')
        res.status(200).json(post)
    } catch (err) {
        res.status(400).json({ msg: err })
    }
})

// @routes Delete api/posts
// @dest Delete An post
router.delete('/:id', async (req, res) => {
    try {
        const posts = await Db.remove(req.params.id);
        if (!posts) throw Error('No post found!');
        res.status(200).json(posts);
    } catch (err) {
        res.status(400).json({ msg: err })
    }
})

// @routes Update api/posts
// @dest update An post
router.patch('/:id', async (req, res) => {
    try {
        const posts = await Db.update(req.params.id, req.body);
        if (!posts) throw Error('Something went wrong while update the post');
        const allposts = await Db.findAll();
        res.status(200).json(allposts);
    } catch (err) {
        res.status(400).json({ msg: err })
    }
})
module.exports = router;