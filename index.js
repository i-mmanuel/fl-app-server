require('./models/User')
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MONGO_URI = require('./config/key');
const requireAuth = require('./middlewares/requireAuth');

// Creating the app and setting the port.
const app = express();

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
mongoose.connection.on(`connected`, () => { console.log(`Connected to mongo instance`) });
mongoose.connection.on(`error`, error => { console.log(`Error connecting to mongo instance`, error) });

// Middlewares.
app.use(express.json());
app.use(authRoutes);

// Base route.
app.get('/', requireAuth, (request, response) => {
    response.send(`Your email: ${request.user.email}`);
});

const PORT = 8080 || process.env.PORT;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));