let db = require('../DB/db');
let messageList=[];

async function addMessage(receiverId, senderId, subject, content) {
    // let result = await db.query(`INSERT INTO public.message_topic (subject, sender_id_fkey, receiver_id_fkey) VALUES('${subject}', ${senderId},'${receiverId}') RETURNING id;`);
    // let message_topic_id = result.rows[0].id;
    // await db.query(`INSERT INTO public.message(sender_id_fkey, message_string, message_topic_id_fkey) VALUES(${senderId}, '${content}', ${message_topic_id})`);

    let now= new Date(); 
    let insertText = `INSERT INTO public.message_topic (subject, sender_id_fkey, receiver_id_fkey, date) VALUES($1, $2, $3, $4) RETURNING id;`
    let result = await db.query(insertText, [subject, Number(senderId), Number(receiverId), now]);
    
    let message_topic_id = result.rows[0].id;
    insertText = 'INSERT INTO public.message(sender_id_fkey, message_string, message_topic_id_fkey, date) VALUES ($1, $2, $3, $4)';
    await db.query(insertText, [Number(senderId), content, Number(message_topic_id), now]);

    await updateLocalData();
}

async function addMessageToTopic(e) {
    let senderId = e.senderId;
    let content = e.message;
    let message_topic_id = e.messageTopicId;
    let now= new Date(); 

    const insertText = 'INSERT INTO public.message(sender_id_fkey, message_string, message_topic_id_fkey, date) VALUES ($1, $2, $3, $4)';
    await db.query(insertText, [Number(senderId), content, Number(message_topic_id), now]);

    await updateLocalData();
}

async function getAllMessages() {
    if (messageList.length == 0)
    {
        await updateLocalData();
    }    
    return messageList;
}

async function getMessageTopic(id) {
    if (messageList.length == 0)
    {
        await updateLocalData();
    } 
 
    if (id === undefined || id == null) {
        return {};
    }

    let topicObj = messageList.filter(x => x.topic.id === Number(id));

    if(topicObj.length !== 1)    // something wrong here
        return {};
    else
        return topicObj[0].topic;
}

async function getMessageCountBySender(id) {
    let rawMsgData = await db.query('SELECT * from public.message WHERE sender_id_fkey=' + id + ";");

    return rawMsgData.rows.length;
}

async function updateLocalData() {
    let rawMsgTopicData = await db.query('SELECT * from public.message_topic');
    let msgTopicData = rawMsgTopicData.rows;

    let rawMsgData = await db.query('SELECT * from public.message');
    let msgData = rawMsgData.rows;

    // console.log(msgTopicData);
    // console.log(msgData);

    messageList = [];
    msgTopicData.forEach(element => {
        let msgObj = {};
        msgObj.topic = element;
        msgObj.message = msgData.filter(x => x.message_topic_id_fkey === element.id);
        
        messageList.push(msgObj);
    });
    
    // console.log(message_List);
}

module.exports = {
    add : addMessage,
    addMsgOnly : addMessageToTopic,
    getall : getAllMessages,
    getTopicByid: getMessageTopic,
    getCount: getMessageCountBySender
}