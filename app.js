const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')  //not adding (session) at the end here
const connectDB = require('./config/db')
const { default: mongoose } = require('mongoose')

//Load config
dotenv.config({ path: './config/config.env' })

//Passport config
require('./config/passport')(passport)


connectDB()

const app = express()



//Body parser --> basically making the form to add stories work
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



//Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))





//Logging - use morgan only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


//Handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')




//Handlebars code to shorten to .hbs
// Added word .engine since its been updated
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main',
    extname: '.hbs'
})
)
app.set('view engine', '.hbs');



//Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))




//Passport middleware
app.use(passport.initialize())
app.use(passport.session())


//Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null           //Uses a global variable to access user value thrpugh passport just above
    next()                                       //Literally just triggers the next piece of middleware so the sequence of functions doesn't break
})



//Static folder
app.use(express.static(path.join(__dirname, 'public')))







//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))




const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on PORT ${PORT}`))