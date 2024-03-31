const path = require('path');
const express = require('express')


const configViewEngine = (app) => {
    app.set('views', path.join('./scr', 'views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join('./scr', 'public')));
}

module.exports = configViewEngine;
