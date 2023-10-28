const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

const rankRouter = require("./router/rank");
const mainRouter = require("./router/main");
const postRouter = require("./router/post");

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

app.use("/rank", rankRouter);
app.use("/home", mainRouter);
app.use("/post", postRouter);
