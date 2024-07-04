import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';

// Crear una nueva instancia de la aplicación Express
const app = express();

// Puerto en el que se ejecuta el servidor Express
const port = 3000;

// Nombre del archivo de base de datos SQLite
const filename = 'sigma.db';

// Inicializar Sequelize con el dialecto SQLite y el archivo de almacenamiento
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

/**
 * Modelo de libro.
 * @class Book
 * @extends Model
 */
class Book extends Model {}

// Definir el modelo Book
Book.init({
    autor: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'El autor del libro'
    },
    isbn: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        comment: 'El número ISBN del libro'
    },
    editorial: {
        type: DataTypes.STRING,
        comment: 'La editorial del libro'
    },
    paginas: {
        type: DataTypes.INTEGER,
        comment: 'El número de páginas del libro'
    }
}, { sequelize, modelName: 'book' });

// Sincronizar Sequelize con la base de datos
sequelize.sync();

// Configurar middleware para parsear el body de las peticiones
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Obtener todos los libros.
 * @route GET /books
 * @returns {Promise<object[]>} Array de objetos Book.
 */
app.get('/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

/**
 * Obtener un libro específico por su ID.
 * @route GET /books/:id
 * @param {string} req.params.id - El ID del libro.
 * @returns {Promise<object>} Objeto Book encontrado.
 */
app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.json(book);
});

/**
 * Crear un nuevo libro.
 * @route POST /books
 * @param {object} req.body - Objeto del libro a crear.
 * @returns {Promise<object>} Objeto Book creado.
 */
app.post('/books', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

/**
 * Actualizar un libro por su ID.
 * @route PUT /books/:id
 * @param {string} req.params.id - El ID del libro a actualizar.
 * @param {object} req.body - Objeto del libro actualizado.
 * @returns {Promise<object>} Objeto Book actualizado.
 */
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'Libro no encontrado' });
    }
});

/**
 * Eliminar un libro por su ID.
 * @route DELETE /books/:id
 * @param {string} req.params.id - El ID del libro a eliminar.
 * @returns {Promise<object>} Mensaje de éxito.
 */
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'Libro eliminado' });
    } else {
        res.status(404).json({ message: 'Libro no encontrado' });
    }
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
