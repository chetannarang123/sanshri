const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ChatController = require('../controller/api');


router.post("/chatList", checkAuth, ChatController.chatList);
// router.get('',checkAuth,ChatController.getConversations);
// router.get('/:conversationId',checkAuth,ChatController.getConversation);
// router.post("/sendreply/:conversationId",checkAuth,ChatController.sendReply);
// router.post("/new/:recipient",checkAuth,ChatController.newConversation);

module.exports = router;