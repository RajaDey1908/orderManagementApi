import Chat from '../../Models/Chat';
import ChatUser from '../../Models/ChatUser';
import ChatFavourite from '../../Models/ChatFavourite';
import ChatUnread from '../../Models/ChatUnread';
import ChatLastUser from '../../Models/ChatLastUser';
import User from '../../Models/User';
import config from '../../../config/config';
import { json } from 'express';
import mongoose from 'mongoose';
import moment from 'moment';


/**
 * chatCreate
 * message create here
 * @param req body
 * return JSON
 */
const chatCreate = async (req, res) => {
    if (req.body.receiverId == null || req.body.message == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        let senderId = req.id;
        let receiverId = req.body.receiverId;
        let roomId;
        const getChatData = await Chat.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
            .limit(2);
        if (getChatData.length > 0) {
            roomId = getChatData[0].roomId;
        } else {
            roomId = senderId + '_' + receiverId;
        }

        const unreadChat = await ChatUnread.find({ senderId: senderId, receiverId: receiverId, isActive: true, isDeleted: false });
        // const lasttUserDetails = await ChatLastUser.find({ senderId: receiverId, isActive: true, isDeleted: false });
        // return
        // console.log("lasttUserDetails--lastUserId--", lasttUserDetails[0].lastUserId)
        // console.log("receiverId--", senderId)
        // return
        console.log("in add chat-------------")
        if (unreadChat.length > 0) {
            var today = moment().toISOString();
            let oldDateTime = moment(unreadChat[0].updatedDate);
            let currentDateTime = moment(today);
            let timeDifference = currentDateTime.diff(oldDateTime, 'minutes')
            // console.log("in if")
            // if (lasttUserDetails[0].lastUserId != senderId) {
            //     // console.log("in inner if")
            //     let unreadMessage = parseInt(unreadChat[0].unreadMessage) + 1;
            //     const updateData = await ChatUnread.findByIdAndUpdate(
            //         { _id: unreadChat[0]._id },
            //         {
            //             $set: { unreadMessage: unreadMessage, updatedDate: new Date().toISOString() }
            //         }
            //     )
            // } else {
                // if (timeDifference > 2) {
                let unreadMessage = parseInt(unreadChat[0].unreadMessage) + 1;
                const updateData = await ChatUnread.findByIdAndUpdate(
                    { _id: unreadChat[0]._id },
                    {
                        $set: { unreadMessage: unreadMessage, updatedDate: new Date().toISOString() }
                    }
                )
                // }
            // }
        } else {
            // console.log("in else")
            const addChat = await new ChatUnread({
                senderId: senderId,
                receiverId: receiverId,
                unreadMessage: 1,
                updatedDate: new Date().toISOString()
            }).save();
        }


        // const updateUnreadData = await ChatUnread.findOneAndUpdate(
        //     { senderId: mongoose.Types.ObjectId(receiverId), receiverId: mongoose.Types.ObjectId(senderId) },
        //     {
        //         $set: { unreadMessage: 0, updatedDate: new Date().toISOString() }
        //     }
        // )

        // res.status(200).json({ msg: "message sent" });
        // return
        const existChat = await ChatUser.find({ roomId: roomId, isActive: true, isDeleted: false });
        if (existChat.length > 0) {
            const updateData = await ChatUser.findByIdAndUpdate(
                { _id: existChat[0]._id },
                {
                    $set: { senderId: senderId, receiverId: receiverId, message: req.body.message, updatedDate: new Date().toISOString() }
                }
            )
        } else {
            const updateData = await new ChatUser({
                senderId: senderId, receiverId: receiverId, message: req.body.message, roomId: roomId, updatedDate: new Date().toISOString()
            }).save();
        }
        const addChat = await new Chat({
            roomId: roomId,
            senderId: senderId,
            receiverId: receiverId,
            message: req.body.message
        }).save();
        res.status(200).json({ msg: "message sent" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * inboxList
 * Inbox chat list\
 * return JSON
 */
const inboxList = async (req, res) => {
    if (req.params.receiverId == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {

        let limit = 10;
        // let page = req.query.page;
        let page = 0;
        let skip = (limit * page);

        let senderId = req.id;
        let receiverId = req.params.receiverId;
        // console.log('senderId=> ', senderId)
        // console.log('receiverId=> ', receiverId)
        const chatList = await Chat.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ],
            isDeleted: false,
            isActive: true
        })
            .populate({
                path: 'senderId receiverId',
                model: 'user',
                select: 'name profilePicture'
            }).skip(skip)
            .limit(limit)
            .sort({ createdDate: 'DESC' });
        res.status(200).json({ data: chatList });
    } catch (err) {
        console.log('Error => ', err.message)
        res.status(500).json({ message: "Something went wrong!!!" });
    }
}

/** Chat list */
const chatList = async (req, res) => {
    try {
        // console.log("req.body----", req.body)
        let senderId = req.id;
        let searchText = req.body.searchText;
        const chatUserList = await ChatUser.find({
            $or: [{ senderId: senderId }, { receiverId: senderId }]
        })
            .populate({
                path: 'senderId receiverId',
                model: 'user',
                select: 'name profilePicture',
                // match: { name: "Raja Dey" },
                match: { 'name': { '$regex': searchText, '$options': 'i' } }
            })
            .sort({ updatedDate: 'DESC' });

        // const chatUserfavouriteList = await ChatFavourite.find({
        //     roomId:"5eecd53f5e372ba9bc6d36ee_5ee0ce2ec88c6357d6cf56d8",
        //     favouriteBy:"5ee0ce2ec88c6357d6cf56d8"
        // })
        // console.log("chatUserfavouriteList----------", chatUserfavouriteList)
        res.status(200).json({ data: chatUserList });
    } catch (err) {
        console.log('Error => ', err.message)
        res.status(500).json({ message: "Something went wrong!!!" });
    }
}


/** Chat list */
const chatFavouriteList = async (req, res) => {
    try {
        let senderId = req.id;
        let searchText = req.body.searchText;
        const chatUserList = await ChatUser.find({
            $or: [{ senderId: senderId }, { receiverId: senderId }]
        })
            .populate({
                path: 'senderId receiverId',
                model: 'user',
                select: 'name profilePicture',
                match: { 'name': { '$regex': searchText, '$options': 'i' } }
            })
            .sort({ updatedDate: 'DESC' });

        const unreadChat = await ChatUnread.find({ receiverId: senderId, isActive: true, isDeleted: false });

        // console.log("chatUserList---", chatUserList)

        let finalChatUserList = []
        for (let i = 0; i < chatUserList.length; i++) {
            let ChatFavouriteDetails = await ChatFavourite.find({
                roomId: chatUserList[i].roomId,
                favouriteBy: senderId
            });
            let textObject = JSON.parse(JSON.stringify(chatUserList[i]));

            if (ChatFavouriteDetails.length > 0) {
                textObject.ChatFavouriteDetails = JSON.stringify(ChatFavouriteDetails);
            } else {
                textObject.ChatFavouriteDetails = '';
            }

            // let chatObject = JSON.parse(JSON.stringify(chatUserList[i]));

            // if (chatUserList[i].receiverId) {
            //     console.log("11111111111")
            //     if (chatUserList[i].receiverId._id == senderId) {
            //         console.log("222222222")
            //         for (let j = 0; j < unreadChat.length; j++) {
            //             if (JSON.stringify(chatUserList[i].receiverId._id) == JSON.stringify(unreadChat[j].receiverId)) {
            //                 console.log("in first if")
            //                 textObject.unreadChat = unreadChat[j].unreadMessage;
            //             }
            //         }
            //     }
            // }
            // if (chatUserList[i].senderId) {
            //     console.log("3333333")
            //     if (chatUserList[i].senderId._id == senderId) {
            //         console.log("4444444444444")
            //         for (let j = 0; j < unreadChat.length; j++) {
            //             if (JSON.stringify(chatUserList[i].senderId._id) == JSON.stringify(unreadChat[j].receiverId)) {
            //                 console.log("in second if")
            //                 textObject.unreadChat = unreadChat[j].unreadMessage;
            //             }
            //         }
            //     }
            // }
            finalChatUserList.push(textObject)
            // finalChatUserList.push(chatObject)
        }
        // console.log("after---finalChatUserList", finalChatUserList)
        let sendData = {
            unreadChat: unreadChat,
            finalChatUserList: finalChatUserList
        }

        // res.status(200).json({ data: chatUserList });
        // res.status(200).json({ data: finalChatUserList });
        res.status(200).json({ data: sendData });
    } catch (err) {
        console.log('Error => ', err.message)
        res.status(500).json({ message: "Something went wrong!!!" });
    }
}


/**
 * chatFavourite
  * @param req body
  * @returns JSON
 */
const addChatFavourite = async (req, res) => {
    try {
        let senderId = req.id;
        let receiverId = req.params.receiverId;
        // console.log('senderId=>------- ', senderId)
        // console.log('receiverId=>----------', receiverId)
        const chatListDetails = await ChatUser.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ],
            isDeleted: false,
            isActive: true
        })

        const ChatFavouriteDetails = await ChatFavourite.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ],
            favouriteBy: senderId,
            isDeleted: false,
            // isActive: true
        });
        // console.log("ChatFavouriteDetails-----------", ChatFavouriteDetails)
        if (ChatFavouriteDetails.length > 0) {
            // console.log("in if-------")
            if (ChatFavouriteDetails[0].isActive == true) {
                // console.log("in inner if-------")
                const updateFavourite = await ChatFavourite.findByIdAndUpdate(
                    { _id: ChatFavouriteDetails[0]._id },
                    {
                        $set: { isActive: false }
                    }
                );
                res.status(200).json({ msg: "success" });
            } else {
                // console.log("in inner---else----")
                const updateFavourite = await ChatFavourite.findByIdAndUpdate(
                    { _id: ChatFavouriteDetails[0]._id },
                    {
                        $set: { isActive: true }
                    }
                );
                res.status(200).json({ msg: "Success" });
            }
        } else {
            // console.log("in else-------")
            const addFavourite = await new ChatFavourite({
                favouriteBy: senderId,
                senderId: senderId,
                receiverId: receiverId,
                roomId: chatListDetails[0].roomId
            })
                .save();
            res.status(200).json({ msg: "Success" });
        }
    } catch (err) {
        console.log("Error => 11", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}


/**
 * chatUpdateUnread
 * message create here
 * @param req body
 * return JSON
 */
const chatUpdateUnread = async (req, res) => {
    if (req.body.receiverId == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        let senderId = req.id;
        let receiverId = req.body.receiverId;
        let unreadMessage = 0;
        console.log(" in chatUpdateUnread ---")
        console.log(" in senderId ------", senderId)
        console.log(" in receiverId--------- ", receiverId)

        const lasttUserDetails = await ChatLastUser.find({ senderId: senderId, isActive: true, isDeleted: false });

        if (lasttUserDetails.length > 0) {
            const updateData = await ChatLastUser.findByIdAndUpdate(
                { _id: lasttUserDetails[0]._id },
                {
                    $set: { lastUserId: receiverId, updatedDate: new Date().toISOString() }
                }
            )
        } else {
            const addChat = await new ChatLastUser({
                senderId: senderId,
                lastUserId: receiverId,
                updatedDate: new Date().toISOString()
            }).save();
        }


        const updateData = await ChatUnread.findOneAndUpdate(
            { senderId: mongoose.Types.ObjectId(receiverId), receiverId: mongoose.Types.ObjectId(senderId) },
            {
                $set: { unreadMessage: 0, updatedDate: new Date().toISOString() }
            }
        )
        res.status(200).json({ msg: "Read Message Successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}


/**
 * chatResetUnread
 * message create here
 * @param req body
 * return JSON
 */
const chatResetUnread = async (req, res) => {
    if (req.body.receiverId == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        let senderId = req.id;
        let receiverId = req.body.receiverId;

        const lasttUserDetails = await ChatLastUser.find({ senderId: senderId, isActive: true, isDeleted: false });

        if (lasttUserDetails.length > 0) {
            const updateData = await ChatLastUser.findByIdAndUpdate(
                { _id: lasttUserDetails[0]._id },
                {
                    $set: { lastUserId: "", updatedDate: new Date().toISOString() }
                }
            )
        } else {
            const addChat = await new ChatLastUser({
                senderId: senderId,
                lastUserId: receiverId,
                updatedDate: new Date().toISOString()
            }).save();
        }
        res.status(200).json({ msg: "Unread Reset Successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}


export default { chatCreate, inboxList, chatList, addChatFavourite, chatFavouriteList, chatUpdateUnread, chatResetUnread }