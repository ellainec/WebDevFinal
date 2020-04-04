let mod = require('../models/postData.js');
let mod_user = require('../models/userData.js');

//TODO: remove duplicate
function formatPosts(postList) {
    let result =  postList.map((each) => {
        if (!each.post) {
            if (!each.date) {
                //date is null, nothing to do
                return each;
            }
            let dateArray = each.date.toDateString().split(" ");
            let formattedDate = "" + dateArray[2] + dateArray[1].toLowerCase() + dateArray[3];
            return {
                ...each,
                date: formattedDate
            }
        } else {
            if (!each.post.date) {
                //date is null, nothing to do
                return each;
            }
            let dateArray = each.post.date.toDateString().split(" ");
            let formattedDate = "" + dateArray[2] + dateArray[1].toLowerCase() + dateArray[3];
            return {
                post: {
                    ...each.post,
                    date: formattedDate
                },
                comments: each.comments
            }
        }
    });
    return result;
}

exports.showMyPostPage = async function(req,res,next) {  
    let userId = req.session.userId;

    let userObj = await mod_user.getByid(userId);

    let rawPostList = await mod.getPostsByUser(userId);
    let prePostList = formatPosts(rawPostList);
    let postList = prePostList.map((element) => {
        let otherUserObj = mod_user.getByid(element.post.member_id_fkey);
        element.post.image_url = otherUserObj.image_url;
        return element;
    })

    res.render('myPostPage' ,{
        user: userObj,
        posts: postList,
        postCSS: true,
        myPostCSS: true
    });
}

exports.showOthersPostPage = async function(req,res,next) {  
    let otherUserId = req.query.userId; 

    let otherUserObj = await mod_user.getByid(otherUserId);

    let rawPostList = await mod.getPostsByUser(otherUserId);
    let prePostList = formatPosts(rawPostList);
    let postList = prePostList.map((element) => {
        let otherUserObj = mod_user.getByid(element.post.member_id_fkey);
        element.post.image_url = otherUserObj.image_url;
        return element;
    })

    res.render('othersPostPage' ,{
        user: otherUserObj,
        posts: postList,
        postCSS: true,
        otherPostCSS: true      
    });
}

exports.showPostPage = async function(req,res,next) {  
    let postsData = await mod.getPostsByPage();
    res.render('postPage' ,{postsData, postCSS: true});

}

exports.showComments = function(req,res,next) { 
    let postId = req.body.postId;
    let comments = mod.getCommentsById(postId);
    comments.then((data) => {
        res.render('postPage' ,{ post: mod.getPostsByPage, postId: postId, comments: mod.getCommentsById(postId) });
    })
}

exports.addNewComment = async function(req,res,next) {
    let newComment = {};
    newComment.comment_string = req.body.postString;
    newComment.member_id_fkey = req.session.userId;
    newComment.post_id_fkey = req.body.id;
    
    await mod.addComment(newComment);
    
    console.log("Add comment successful");
    res.redirect('/main/:page');
}

exports.searchBySubject = async function(req,res,next) {
    let searchTerm = req.body.searchTerm;
    let matched = [];
    let rawPosts = await mod.getPostsBySubject(searchTerm);
    console.log(JSON.stringify(rawPosts, null, 1));
    let matchedPosts = formatPosts(rawPosts);
    if (matchedPosts.length == 0) {
        res.render('postPage' ,{ postCSS: true, postsData: matched, noMatch: true});
    }
    matchedPosts.forEach(async (post, index, arr) => {
        let matchedComments = await mod.getCommentsById(post.id);
        matched.push({ post, comments: matchedComments.rows, replies: matchedComments.rows.length});
        if(Object.is(arr.length-1, index)) {
            res.render('postPage' ,{ postCSS: true, postsData: matched});
        }
    });
}
