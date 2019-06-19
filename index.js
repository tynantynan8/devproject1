const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');


mongoose.connect(keys.mongoURI);

const app = express();
app.use(bodyParser.json());
app.use(
    cookieSession({
            maxAge: 30 * 24 * 60 * 60 *1000,
            keys: [keys.cookieKey] //using arrays allow layers of cookies to be randomly chosen for extra layers of security

        })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production'){
    //express serves assets
    //like our main.js or main.css
app.use(express.static('client/build'));
    //express will serve index.html if it doesnt recgonize the route
const path = require('path');
app.get('*',(req, res)=> {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
}



const PORT = process.env.PORT || 5000;
app.listen(PORT);