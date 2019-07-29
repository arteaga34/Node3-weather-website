const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


// Setup handlebars engine and views location
app.set('view engine', 'index');
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index.hbs', {
        title: 'Weather App',
        name: 'Michael Arteaga'
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'About Me',
        name: 'Michael Arteaga'
    })
})

app.get('/help', (req, res) => {
    res.render('help.hbs', {
        helpText: 'This is the Help Page!',
        title: 'Help',
        name: 'Michael Arteaga'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an addy"
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } ={} ) => {
        if(error){
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location, 
                address: req.query.address
            })        
        })
    })

})

app.get('/products', (req, res) => {
if (!req.query.search) {
    return res.send({
        error: 'You must provide a search term!'
    })
}

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404.hbs', {
        title: '404',
        name: "Michael Arteaga",
        errorMessage: 'Help Page could not be found!'
    })
})

app.get('/about/*', (req, res) => {
    res.render('404.hbs', {
        title: '404',
        name: "Michael Arteaga",
        errorMessage: 'About Page could not be found!'
    })
})

app.get('*', (req, res) => {
    res.render('404.hbs', {
        title: '404',
        name: "Michael Arteaga",
        errorMessage: 'Page could not be found!'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
