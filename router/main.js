const express = require('express');
const axios = require('axios');
const router = express.Router();
const fs = require('fs');

const gitlabBaseUrl = 'https://git.ajou.ac.kr/api/v4'; // GitLab URL 변경 필요

router.get('/', async (req, res) => {
    const jsonFile = fs.readFileSync('./data/post.json', 'utf8');
    const jsonData = JSON.parse(jsonFile);
    const posts = jsonData.post;

    const jsonFile2 = fs.readFileSync('./data/activity_time.json', 'utf8');
    const jsonData2 = JSON.parse(jsonFile2);
    const comment_history = jsonData2.comment_time;
    const issue_history = jsonData2.issue_time;
    const push_history = jsonData2.push_time;

    const userId = req.query.id
    const post_num = req.query.uid
    const like_num = req.query.like

    try {
        const response = await axios.get(`${gitlabBaseUrl}/users/${userId}/events`);

        if (response === undefined) throw new Error("실 사용자 아님")

        const activity_log = response.data
        
        for (let i = activity_log.length - 1; i >= 0 ; i--)
        {
            if (activity_log[i].action_name == "commented on")
            {
                var returnValue = comment_history.find(function(data){ return data === activity_log[i].created_at});

                if (returnValue === undefined)
                {
                    posts.push({"uid": posts.length, "id" : userId, "content" : `commented : ${activity_log[i].note.body}`, "like" : 0,  "tag" : ["comments"]});
                    comment_history.push(activity_log[i].created_at)
                }
            }
            else if (activity_log[i].target_type == "Issue" && activity_log[i].action_name == "opened")
            {
                var returnValue = issue_history.find(function(data){ return data === activity_log[i].created_at});

                if (returnValue === undefined)
                {
                    posts.push({"uid": posts.length, "id" : userId, "content" : `opened issue : ${activity_log[i].target_title}`, "like" : 0,  "tag" : ["issue"]});
                    issue_history.push(activity_log[i].created_at)
                }
            }
            else if (activity_log[i].action_name == "pushed to")
            {
                var returnValue = push_history.find(function(data){ return data === activity_log[i].created_at});

                if (returnValue === undefined)
                {
                    posts.push({"uid": posts.length, "id" : userId, "content" : `pushed to ${activity_log[i].push_data.ref_type} : ${activity_log[i].push_data.commit_title}`, "like" : 0,  "tag" : ["push"]});
                    push_history.push(activity_log[i].created_at)
                }
            }
            else if (activity_log[i].action_name == "pushed new")
            {
                var returnValue = push_history.find(function(data){ return data === activity_log[i].created_at});

                if (returnValue === undefined)
                {
                    posts.push({"uid": posts.length, "id" : userId, "content" : `pushed new : ${activity_log[i].push_data.commit_title}`, "like" : 0,  "tag" : ["push"]});
                    push_history.push(activity_log[i].created_at)
                }
            }
        }

        fs.writeFileSync('./data/activity_time.json', JSON.stringify({ "comment_time" : comment_history, "issue_time" : issue_history, "push_time" : push_history }))
    }   
    catch(e) {
            // 오류 발생시 실행
        
        console.log("오류")
    }

    if (post_num !== undefined && like_num !== undefined)
    {
        posts[post_num].like = like_num
    }

    fs.writeFileSync('./data/post.json', JSON.stringify({ "post" : posts }))

    const temp = posts.reverse()

    res.json(temp)
})

module.exports = router;