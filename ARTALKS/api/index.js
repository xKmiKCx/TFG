const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("./models/User.js");
const Event = require("./models/Events.js");
const Booking = require("./models/Booking.js");
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const { PORT = 4000, CLIENT_ID, APP_SECRET } = process.env;
const app = express();

const base = "https://api-m.sandbox.paypal.com";

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'KjfRroPDrBb89iLaAcr4Hg89aQxV';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));
mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test ok');
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });

        } else {
            res.status(422).json('Contraseña incorrecta');
        }
    } else {
        res.json('email no encontrado');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
});

app.post('/logout', async (req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/uploadLink', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
});

const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const savedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        savedFiles.push(newPath.replace('uploads\\', ''));
    }
    res.json(savedFiles);
});

app.post('/events', (req, res) => {
    const { token } = req.cookies;
    const { title, address, photos, description, perks, info, checkInDate, checkInTime, maxGuests, price } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const eventDoc = await Event.create({
            owner: userData.id,
            title, address, photos,
            description, perks, info,
            checkInDate, checkInTime, maxGuests, price
        });
        res.json(eventDoc);
    });
});

app.get('/user-events', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Event.find({ owner: id }));
    });
});

app.get('/events/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Event.findById((id)));
});

app.put('/events', async (req, res) => {
    const { token } = req.cookies;
    const { id, title, address, photos, description, perks, info, checkInDate, checkInTime, maxGuests, price } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const eventDoc = await Event.findById((id));
        if (userData.id === eventDoc.owner.toString()) {
            eventDoc.set({
                title, address, photos,
                description, perks, info,
                checkInDate, checkInTime, maxGuests,
                price
            });
            await eventDoc.save();
            res.json('ok');
        }
    })

});

app.get('/events', async (req, res) => {

    res.json(await Event.find());
});

function RequestUserData(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
    });
}

app.post('/bookings', async (req, res) => {
    const userData = await RequestUserData(req);
    const { event, checkInDate, checkInTime, numberGuests, finalPrice } = req.body;
    try {
        const bookingDoc = await Booking.create({
            event,
            user: userData.id,
            checkInDate,
            checkInTime,
            numberGuests,
            finalPrice
        });
        res.json(bookingDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.get('/bookings', async (req, res) => {
    const userData = await RequestUserData(req);
    res.json(await Booking.find({ user: userData.id }).populate('event'));
});



//PAYPAL SECTION

app.post("/create-paypal-order", async (req, res) => {
    try {
        console.log(req.body);
        const order = await createOrder(req.body);
        res.json(order);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/capture-paypal-order", async (req, res) => {
    const { orderID } = req.body;
    console.log("orderID: ", orderID);
    try {
        const captureData = await capturePayment(orderID);
        res.json(captureData);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//---------------------------

async function createOrder(data) {
    console.log("data: ",data);
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "EUR",
                        value: data.product.cost,
                    },
                },
            ],
        }),
    });

    return handleResponse(response);
}

async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    //Database save here
    return handleResponse(response);
}

async function generateAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });

    const jsonData = await handleResponse(response);
    return jsonData.access_token;
}

async function handleResponse(response) {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }

    const errorMessage = await response.text();
    throw new Error(errorMessage);
}







app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}/`);
});
