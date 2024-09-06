import express, { json } from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2';




const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type'
};

app.use(cors(corsOptions));
app.use(json());


const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cars_store'
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});


// Get Cars With Pages & Pagination Data
app.get('/cars', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const rowsPerPage = 4;
    try {
        const [totalRowsResult] = await db.promise().query('SELECT COUNT(*) AS count FROM cars');
        const totalRows = totalRowsResult[0].count;
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        const offset = (page - 1) * rowsPerPage;
        const [cars] = await db.promise().query('SELECT * FROM cars LIMIT ? OFFSET ?', [rowsPerPage, offset]);
        res.json({
            data: cars,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRows: totalRows
            }
        });
    } catch (err) {
        console.error('Error fetching cars with pagination:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Update cars 
app.put('/cars', async (req, res) => {
    const cars = req.body;
    const query = 'UPDATE cars SET color = ?, model = ?, code = ? WHERE id = ?';

    try {
        await Promise.all(
            cars.map(car => {
                const { id, color, model, code } = car;
                return new Promise((resolve, reject) => {
                    db.query(query, [color, model, code, id], (err, results) => {
                        if (err) {
                            console.error(`Error updating car with ID ${id}:`, err);
                            return reject(err);
                        }
                        console.log('Data updated for ID:', id);
                        resolve(results);
                    });
                });
            })
        );
        res.sendStatus(200);
    } catch (err) {
        console.error('Error updating cars:', err);
        res.status(500).send('Error updating one or more cars');
    }
});

// Add New Cars
app.post('/cars', (req, res) => {
    const { item_name, color, model, code } = req.body;
    const query = 'INSERT INTO cars (item_name, color, model, code) VALUES (?, ?, ?, ?)';

    try {
        db.query(query, [item_name, color, model, code], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).send('Error inserting data');
                return;
            }
            res.status(201).json({ id: results.insertId });
        });
    } catch (err) {
        console.error('Unexpected error while inserting a car:', err);
        res.status(500).send('Internal Server Error');
    }
});


// DELETE Car by ID
app.delete('/cars/:id', (req, res) => {
    const carId = req.params.id;
    const query = 'DELETE FROM cars WHERE id = ?';
    db.query(query, [carId], (err, result) => {
        if (err) {
            console.error('Error deleting car:', err);
            return res.status(500).send('Error deleting car');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Car not found');
        }
        res.status(200).send('Car deleted successfully');
    });
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));