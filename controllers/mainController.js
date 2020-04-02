let mod = require('../models/commentData.js');
exports.showMainPage = function(req,res,next) {
    let name = req.session.userId;
    console.log("userid: "+name);
 
    let postList = [
        {
            image_url: "https://randomuser.me/api/portraits/med/men/22.jpg",
            subject_line:"Testing if this discussion works.",
            topic_name: "php",
            post_string: "Don't mind me. I am just posting.",
            date: "2 apr 2020",
            replies: 5
        },
        {
            image_url: "https://randomuser.me/api/portraits/med/women/26.jpg",
            subject_line:"Hello World!",
            topic_name: "node",
            post_string: "Mmmmmmm Reese's Pieces.",
            date: "2 apr 2020",
            Replies: 1
        }
    ];

    let userObj = {
        ImageUrl: "https://randomuser.me/api/portraits/med/men/22.jpg",
        FirstName: "Kevin",
        LastName: "White",
        Description: "This is a test from somewhere",
        PostNo: 5,
        MsgNo: 10,
        LikesNo: 30
    }
    res.render('mainPage' ,{
        user: userObj,
        posts: postList,
        postCSS: true,
        mainPageCSS: true
    });
}

exports.logout = function(req,res,next) {  
    let replyObj = req.body;
    console.log(replyObj); 
    res.render('loginPage' ,{      
    });
}

exports.searchByTitle = function(req,res,next) {
    let replyObj = req.body
    console.log(replyObj); 
    res.render('postPage' ,{      
    });
}

exports.searchByTopic = function(req,res,next) {
    let replyObj = req.body
    console.log(replyObj); 
    res.render('postPage' ,{      
    });
}

exports.postToTimeLine = function(req,res,next) {
    let replyObj = req.body;
    console.log(replyObj); 

    // Updating related data ...

    res.render('mainPage' ,{      
    });
}

exports.next = function(req,res,next) {
    let replyObj = req.body
    console.log(replyObj); 

    // Updating discussion and post data to be displayed 

    res.render('mainPage' ,{      
    });
}

exports.prev = function(req,res,next) {
    let replyObj = req.body
    console.log(replyObj); 

    // Updating discussion and post data to be displayed 

    res.render('mainPage' ,{      
    });
}