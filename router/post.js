const express = require('express');
const router = express.Router(); // 라우터 생성
const fs = require('fs');
const bodyParser = require('body-parser'); // Import bodyParser

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    const jsonFile = fs.readFileSync('./data/post.json', 'utf8');
    const jsonData = JSON.parse(jsonFile);
    const posts = jsonData.post;

    const userId = req.query.id
    const content = req.query.contents;
    const tag = JSON.parse(req.query.tags)

    // 게시물 데이터를 배열에 추가
    posts.push({"uid": posts.length, "id" : userId, "content" : content, "like" : 0,  "tag" : tag});

    // Save the updated posts to post.json
    fs.writeFileSync('./data/post.json', JSON.stringify({ "post" : posts }))
    console.log("게시물 저장 완료")
});

// // 게시물 생성 POST 라우트
// router.post('/', (req, res) => {
//     const jsonFile = fs.readFileSync('./data/post.json', 'utf8');
//     const jsonData = JSON.parse(jsonFile);
//     const posts = jsonData.post;

//     userId = req.query.id

//     const content = req.body.content;
//     const tags = req.body.tags.split(',').map(tag => tag.trim())

//     // 게시물 데이터를 배열에 추가
//     posts.push({"uid": posts.length, "id" : userId, "content" : content, "like" : 0,  "tag" : tags});

//     // Save the updated posts to post.json
//     fs.writeFileSync('./data/post.json', JSON.stringify({ "post" : posts }))
//     console.log("게시물 저장 완료")

//     res.redirect(`/home?id=${userId}`)
// });


module.exports = router;
