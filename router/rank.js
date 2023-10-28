const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');

const gitlabBaseUrl = 'https://git.ajou.ac.kr/api/v4'; // GitLab URL 변경 필요

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const ranktype = req.query.type;

    if (ranktype == 'commits') // ranktype이 commits라면
    {
        const jsonFile = fs.readFileSync('./data/people.json', 'utf8');
        const jsonData = JSON.parse(jsonFile);
        let months = jsonData.month;

        let cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        try { // activity에서 commit 횟수를 count하는 작업
            const response = await axios.get(`${gitlabBaseUrl}/users/${userId}/events`);
            const activity_log = response.data

            if (response === undefined) throw new Error("실 사용자 아님")

            // console.log(response)
        
            // console.log(activity_log);
            console.log(`activity_data count : ${activity_log.length}`);    
         
            for (let i = 0; i < activity_log.length; i++){
                if (activity_log[i].action_name != 'created')
                {
                    // console.log(new Date(activity_log[i].created_at))
                    const nowMonth = (new Date(activity_log[i].created_at)).getMonth() + 1

                    cnt[nowMonth]++
                }
            }

            for (let i = 1; i <= 12; i++){
                if (cnt[i] <= 0)
                    continue

                var returnValue = months[i.toString()].find(function(data){ return data.id === userId});

                if (returnValue === undefined) // people.json에 해당 유저에 대한 정보가 없으면 추가
                {
                    months[i.toString()].push({ "id": userId, "commits": cnt[i] })

                    months[i.toString()] = months[i.toString()].sort((a,b) => {return b.commits - a.commits})
                }
                else // people.json에 해당 유저에 대한 정보가 있으면 commits만 업데이트
                {
                    for (let j = 0; j < months[i.toString()].length; j++)
                    {
                        if (months[i.toString()][j].id == userId)
                            months[i.toString()][j].commits = cnt[i];
                    }

                    months[i.toString()] = months[i.toString()].sort((a,b) => {return b.commits - a.commits})
                }
            }

            fs.writeFileSync('./data/people.json', JSON.stringify({ "month" : months }))

            res.json(months);
        
            console.log(`commits count : ${cnt}`);
            console.log(`sort type : ${ranktype}`)
            
        }   
        catch(e) {
                // 오류 발생시 실행
            
            console.log("실 사용자 아님");
        }
    }
    if (ranktype == "likes")
    {
        const jsonFile = fs.readFileSync('./data/post.json', 'utf8');
        const jsonData = JSON.parse(jsonFile);
        const posts = jsonData.post;

        const temp = posts.sort((a,b) => {return b.like - a.like})

        console.log(`post count : ${temp.length}`)

        res.json(temp)
    }
})

module.exports = router;