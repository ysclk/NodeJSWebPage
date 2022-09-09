const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')
const Post = require('../../models/Post')
const Path = require('path')

router.get('/', (req,res)=>{ 
     res.render('admin/index')     
})

router.get('/categories', (req,res)=>{ 
     Category.find({}).sort({$natural:-1}).then(categories=>{
          res.render('admin/categories',{categories:categories})    
     })
      
})

router.post('/categories', (req,res)=>{ 
     Category.create(req.body, (error, category)=>{
          if(!error){
               res.redirect('categories')
          }
     }) 
})
router.get('/posts', (req,res)=>{ 
     
     Post.find({}).populate({path:'category', model:Category}).sort({$natural:-1}).lean().then(posts =>{
                    
                      res.render('admin/posts', {posts:posts})
               
                  }) 
       
})

router.post('/categories/:id', (req,res)=>{ 
     const id = req.params.id
    // res.send(id)
      Category.remove({_id:id}).then(()=>{
          res.redirect('/admin/categories')   
          
     })   
      
})

router.delete('/posts/:id', (req,res)=>{ 
     const id = req.params.id
    // res.send(id)
      Post.remove({_id:id}).then(()=>{
          res.redirect('/admin/posts')   
          
     })   
      
})

router.get('/posts/edit/:id', (req,res)=>{ 
    // console.log(req.params.id)
     Post.findOne({_id:req.params.id}).then(post=>{
          Category.find({}).then(categories =>{
               res.render('admin/editpost' ,{post:post, categories:categories})
          })
     })
       
})

router.post('/posts/:id', (req,res)=>{
     let post_image = req.files.post_image
     console.log(post_image.name)
     post_image.mv(Path.resolve(__dirname,'../../public/img/post_images',post_image.name))
     Post.findOne({_id:req.params.id}).then(post=>{
          var post = new Post(post);
        //  console.log(post.title)
          post.title=req.body.title
          post.content = req.body.content
          post.date = req.body.date
          post.category =req.body.category
          post.post_image = `/img/post_images/${post_image.name}`
          post.save().then(post=>{
               res.redirect('/admin/posts')
          })
     })
})
module.exports = router