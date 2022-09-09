const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const hostname = '127.0.0.1'
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
//const moment = require('moment')
const {generateDate, limit, truncate,paginate} = require('./helpers/hbs')
//const limit = require('./helpers/limit').limit
//const truncate = require('./helpers/truncate').truncate
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const MongoStore = connectMongo(expressSession)
var methodOverride = require('method-override')
const cors = require('cors')



mongoose.connect('mongodb://localhost/nodeblog_db',{
    useNewUrlParser: true,
    useUnifiedTopology:true    
    //useCreateIndex:true
})


 app.use(expressSession({
    secret: 'TESTSESSION',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection:  mongoose.connection})
})) 



app.use(fileUpload())

app.use(express.static('public'))



/* const hbs = exphbs.create({
    helpers:{
        generateDate : (date, format)=>{
             return moment(date).format(format)
        }
       
    }
}) */

const hbs = exphbs.create({
    helpers: {
        generateDate: generateDate,
        limit: limit,
        truncate: truncate,
        paginate: paginate

    }
})

app.engine('handlebars', hbs.engine);
//app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');



app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json())

/* const mymiddleWare = (req,res,next)=>{
    console.log('Node JS ögreniyorum')
    next()
} */
//app.use('/', mymiddleWare)


//Display Link middleware
app.use((req,res,next)=>{
    const {userId} = req.session
    if(userId){
        res.locals = {
            displayLink : true
        }
    }else{
        res.locals = {
            displayLink : false
        }
    }
    next()
})

//flash  - message middleware
app.use((req,res,next)=>{
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})

const main = require('./routes/main')
const posts = require('./routes/posts')
const users = require('./routes/users')
const admin = require('./routes/admin/index')
const contact = require('./routes/contact')

app.use('/', main)
app.use('/posts', posts)
app.use('/users', users)
app.use('/admin', admin)
app.use('/contact', contact)

app.use(methodOverride('_method'))
app.use(cors())

app.listen(port, hostname, ()=>{
    console.log("server calisiyor, " +  `http://${hostname}:${port}`)
})