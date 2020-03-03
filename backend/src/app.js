const express = require('express');
const userRouter = require('./routers/user');
const articleRouter = require('./routers/article');
const applicationRouter = require('./routers/application');
const port = process.env.PORT;

require('./db/db');

const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(userRouter);
app.use(articleRouter);
app.use(applicationRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});