require('dotenv').config()
const express = require('express');
const app = express();

app.use(express.json());

const user = {
    id: 2,
    name: 'Khan',
    age: 34
}
app.get("/", (req, res) => {
    res.send("hello");

})

app.get("/user", (req, res) => {
    res.json(user);

})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})
module.exports = app;