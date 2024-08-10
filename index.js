import env from 'dotenv'
import express, { json } from 'express';
const app = express();

app.use(json());
env.config();

const user = {
    id: 2,
    name: 'Khan',
    age: 34
}
app.get("/", (req, res) => {
    res.send("hello");

})

app.get("/api/user", (req, res) => {
    res.json(user);

})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})
export default app;