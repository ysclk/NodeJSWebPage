const mongoose= require('mongoose')


const Post = require('./models/Post')

mongoose.connect('mongodb://127.0.0.1/nodeblog1_db',{
    useNewUrlParser: true,
    useUnifiedTopology:true
})

/* Post.findByIdAndDelete('630bc7a8eee76795ea35e4d0',//delete
    (error, post)=>{
        console.log(error, post)
    }
) */

/* Post.findByIdAndUpdate('630bc7a8eee76795ea35e4d0', {//update
    title: 'my first title update'
}, (error,post )=>{
    console.log(error, post)
}) */

/* Post.find({},(error, post)=>{//select
console.log(error,post)
}) */

Post.findById('630bcdee2ee5c9a9c5acfa40',(error, posts)=>{//select
    console.log(error,posts)
})

/* 
 Post.create({//insert
    title: 'my second title',
    content: 'my second content'
}, (error, post)=>{
    console.log(error, post)
})  */