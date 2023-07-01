
const c = require('./index.js');
const express = require("express");

const app = express();

app.get("/", function(request, response){

    // отправляем ответ
    response.send(console.log('b '+ c));
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000);
module.exports = app;
