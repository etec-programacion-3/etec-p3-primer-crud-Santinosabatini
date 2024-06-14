import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';

const app = express();
const port = 3000;

const filename = 'sigma.db'
console.log(filename)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

class Book extends Model { }
Book.init({
    autor: DataTypes.STRING,
    isbn: DataTypes.INTEGER,
    editorial: DataTypes.STRING,
    paginas: DataTypes.INTEGER
}, { sequelize, modelName: 'book' });

sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.json(book);
});

app.post('/books', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

app.put('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
