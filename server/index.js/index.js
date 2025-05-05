const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../')));

// Создаем подключение к базе данных
const db = new sqlite3.Database('./bookings.db', (err) => {
    if (err) {
        console.error('Ошибка при подключении к базе данных:', err.message);
    } else {
        console.log('Подключение к базе данных SQLite установлено');

        // Создаем таблицу, если она не существует
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tour_name TEXT,
            name TEXT,
            contact_method TEXT,
            email TEXT,
            phone TEXT,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Настройка почтового транспорта
const transporter = nodemailer.createTransport({
    service: 'mail',
    auth: {
        user: 'kashinigor327@mail.ru', // Замените на свой email
        pass: 'Igor_2002' // Замените на свой пароль
    }
});

// Маршрут для обработки бронирований
app.post('/api/booking', (req, res) => {
    const { tourName, name, contactMethod, email, phone, message } = req.body;

    // Сохраняем данные в базу
    const sql = `INSERT INTO bookings (tour_name, name, contact_method, email, phone, message) 
                VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [tourName, name, contactMethod, email, phone, message], function (err) {
        if (err) {
            console.error('Ошибка при сохранении данных:', err.message);
            return res.status(500).json({ error: 'Ошибка при сохранении данных' });
        }

        console.log(`Бронирование сохранено с ID: ${this.lastID}`);

        // Отправляем email, если выбран этот метод контакта
        if (contactMethod === 'email' && email) {
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: `Подтверждение бронирования тура "${tourName}"`,
                html: `
                    <h2>Здравствуйте, ${name}!</h2>
                    <p>Благодарим вас за бронирование тура "${tourName}".</p>
                    <p>Мы получили вашу заявку и свяжемся с вами в ближайшее время.</p>
                    ${message ? `<p><strong>Ваш комментарий:</strong> ${message}</p>` : ''}
                    <p>С уважением,<br>Команда QPTour</p>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Ошибка при отправке email:', error);
                } else {
                    console.log('Email отправлен:', info.response);
                }
            });
        }

        res.status(201).json({
            success: true,
            message: 'Бронирование успешно сохранено',
            bookingId: this.lastID
        });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
