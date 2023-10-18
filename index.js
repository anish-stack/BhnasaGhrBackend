const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config({ path: './config/config.env' });

const session = require('express-session');

const User = require('./modals/userSchema')
const authRoutes = require('./routes/roauth')
const connectDB = require('./config/database')
const bodyparser = require('body-parser')
const UserRoutes = require('./routes/userRoutes')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongodb-session')(session);


const store = new MongoStore({
    uri: process.env.DB_URL, // Your MongoDB Atlas connection URI
    collection: 'sessions', // Name of the sessions collection in your database
  });

app.use(
    session({
      secret: 'bfdfcjewvbdjbewbdewkndaewndwjk',
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Session duration (in milliseconds), 24 hours in this example
      },
    })
  );
  app.get('/check-session', (req, res) => {
    if (req.session) {
      res.send('Session exists');
    } else {
      res.send('No session');
    }
  });
  
app.use(cors())
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Route For Checking backend
app.get('/', (req, res) => {
    return res.send("Hello I Am From Backend")
})

app.get('/activate', async (req, res) => {
    try {
        const { token } = req.query;

        // Find the user with the provided token
        const user = await User.findOne({ activationtoken: token });

        if (!user) {
            // Handle the case where the token does not match any user
            throw new ErrorHandler('Invalid or expired activation token', 400);
        }

        // Check if the token has expired
        if (user.activationtokenExpires <= Date.now()) {
            // Handle the case where the token has expired
            throw new ErrorHandler('Activation token has expired', 400);
        }

        // Activate the user's account
        user.isActivated = true;
        await user.save();

        // Redirect the user to a success page or display a success message
        res.status(200).json({ message: 'Account activated successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
})

app.use('/api', UserRoutes)
app.use('/auth', authRoutes);

// calling server
connectDB()
const Port = process.env.PORT

app.listen(Port, () => {
    console.log(`Server Is Running on port number ${Port}`)
})
