import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Pastry from '../models/Pastry.js';

dotenv.config();

const pastries = [
    { name: "Fondant Supreme", number: 5, order: 1 },
    { name: "Éclair au Chocolat", number: 6, order: 2 },
    { name: "Tarte Tatin", number: 7, "order": 3 },
    { name: "Croissant aux Amandes", number: 5, "order": 4 },
    { name: "Macaron Pistache", number: 4, "order": 5 },
    { name: "Pain aux Raisins", number: 6, "order": 6 },
    { name: "Chausson aux Pommes", number: 4, "order": 7 },
    { name: "Mille-feuille", number: 4, "order": 8 },
    { name: "Paris-Brest", number: 4, "order": 9 },
    { name: "Tarte au Citron", number: 5, "order": 10 }
];

connectDB()
    .then(() => {
        console.log('MongoDB connected...');
        return Pastry.insertMany(pastries);
    })
    .then(() => {
        console.log('Pastries inserted successfully!');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error inserting pastries:', err);
    });
