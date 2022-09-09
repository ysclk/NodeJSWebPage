const express = require('express')
const Post = require('../models/Post')
const router = express.Router()
const Category =require('../models/Category')
const User =require('../models/User')

router.get('/', (req,res)=>{
    console.log(req.session)
    res.render('site/index')
})
/* router.get('/admin', (req,res)=>{
    res.render('admin/index')
}) */

router.get('/contact', (req,res)=>{
    res.render('site/contact')
})

router.get('/about', (req,res)=>{
    res.render('site/about')
})

router.get('/blog', (req,res)=>{
    const postPerPage = 3
    const page = req.query.page || 1
  
   Post.find({}).populate({path:'author', model:User}).sort({$natural:-1}).lean()
   .skip((postPerPage * page) - postPerPage)
    .limit(postPerPage)
    .then(posts =>{
        Post.countDocuments().then(postCount =>{
            Category.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'posts'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name:1,
                        num_of_posts:{$size: '$posts'}
                    }
                }
            ]).then(categories =>{
                res.render('site/blog', 
                {
                    posts:posts , 
                    categories:categories,
                    current: parseInt(page),
                    pages:Math.ceil(postCount/postPerPage)
        
                })
            })
        })
   
    /*res.render('site/blog', {      
            posts:posts      
       }) */
     /*      Category.find({}).lean().then(categories =>{
            res.render('site/blog', {posts:posts , categories:categories})
          }) */
        }) 
   })

router.get('/login', (req,res)=>{
    res.render('site/login')
})



module.exports = router