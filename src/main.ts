import fastify from 'fastify'
import formbody from '@fastify/formbody'
import dotenv from 'dotenv'
import { testConnection } from './lib/db'
import Logger from './lib/logger'

testConnection()
dotenv.config()

// accounts
import registerHandler from './features/accounts/registerAccount'
import loginHandler from './features/accounts/loginAccount'

// users
import updateScoreHandler from './features/users/updateScore'
import getUserInfoHandler from './features/users/getUserInfo'
import getUsersHandler from './features/users/getUsers'
import updateUserSettingsHandler from './features/users/updateUserSettings'

// comments
import uploadAccCommentHandler from './features/comments/uploadAccComment'
import getAccCommentsHandler from './features/comments/getAccComments'
import deleteAccCommentHandler from './features/comments/deleteAccComment'
import uploadCommentHandler from './features/comments/uploadComment'
import getCommentsHandler from './features/comments/getComments'
import deleteCommentHandler from './features/comments/deleteComment'
import getCommentHistoryHandler from './features/comments/getCommentHistory'

// friends
import createFriendRequestHandler from './features/friends/uploadFriendRequest'
import removeFriendRequestHandler from './features/friends/removeFriendRequest'
import getFriendRequestsHandler from './features/friends/getFriendRequests'
import blockUserHandler from './features/friends/blockUser'
import unblockUserHandler from './features/friends/unblockUser'
import getUserListHandler from './features/friends/getUserList'
import readFriendRequestHandler from './features/friends/readFriendRequest'
import acceptFriendRequestHandler from './features/friends/acceptFriendRequest'
import removeFriendHandler from './features/friends/removeFriend'

// levels
import uploadLevelHandler from './features/levels/uploadLevel'
import updateDescHandler from './features/levels/updateDesc'
import getLevelsHandler from './features/levels/getLevels'
import downloadLevelHandler from './features/levels/downloadLevel'
import reportLevelHandler from './features/levels/reportLevel'
import deleteLevelUserHandler from './features/levels/deleteLevelUser'

// messages
import uploadMessageHandler from './features/messages/uploadMessage'
import getMessagesHandler from './features/messages/getMessages'
import downloadMessageHandler from './features/messages/downloadMessage'
import deleteMessagesHandler from './features/messages/deleteMessages'

// misc
import likeItemHandler from './features/misc/likeItem'
import getAccountURLHandler from './features/misc/getAccountURL'
import requestUserAccessHandler from './features/misc/requestUserAccess'

const server = fastify({ bodyLimit: 104857600 })
server.register(formbody)

server.post(`${process.env.SERVER_BASE_PATH}/accounts/registerGJAccount.php`, registerHandler)
server.post(`${process.env.SERVER_BASE_PATH}/accounts/loginGJAccount.php`, loginHandler)

server.post(`${process.env.SERVER_BASE_PATH}/updateGJUserScore22.php`, updateScoreHandler)
server.post(`${process.env.SERVER_BASE_PATH}/getGJUserInfo20.php`, getUserInfoHandler)
server.post(`${process.env.SERVER_BASE_PATH}/getGJUsers20.php`, getUsersHandler)
server.post(`${process.env.SERVER_BASE_PATH}/updateGJAccSettings20.php`, updateUserSettingsHandler)

server.post(`${process.env.SERVER_BASE_PATH}/getGJAccountComments20.php`, getAccCommentsHandler)
server.post(`${process.env.SERVER_BASE_PATH}/uploadGJAccComment20.php`, uploadAccCommentHandler)
server.post(`${process.env.SERVER_BASE_PATH}/deleteGJAccComment20.php`, deleteAccCommentHandler)
server.post(`${process.env.SERVER_BASE_PATH}/uploadGJComment21.php`, uploadCommentHandler)
server.post(`${process.env.SERVER_BASE_PATH}/getGJComments21.php`, getCommentsHandler)
server.post(`${process.env.SERVER_BASE_PATH}/deleteGJComment20.php`, deleteCommentHandler)
server.post(`${process.env.SERVER_BASE_PATH}/getGJCommentHistory.php`, getCommentHistoryHandler)

server.post(`${process.env.SERVER_BASE_PATH}/uploadFriendRequest20.php`, createFriendRequestHandler)
server.post(`${process.env.SERVER_BASE_PATH}/deleteGJFriendRequests20.php`, removeFriendRequestHandler)
server.post(`${process.env.SERVER_BASE_PATH}/getGJFriendRequests20.php`, getFriendRequestsHandler)
server.post(`${process.env.SERVER_BASE_PATH}/blockGJUser20.php`, blockUserHandler)
server.post(`${process.env.SERVER_BASE_PATH}/unblockGJUser20.php`, unblockUserHandler)
server.post(`${process.env.SERVER_BASE_PATH}/getGJUserList20.php`, getUserListHandler)
server.post(`${process.env.SERVER_BASE_PATH}/readGJFriendRequest20.php`, readFriendRequestHandler)
server.post(`${process.env.SERVER_BASE_PATH}/acceptGJFriendRequest20.php`, acceptFriendRequestHandler)
server.post(`${process.env.SERVER_BASE_PATH}/removeGJFriend20.php`, removeFriendHandler)

server.post(`${process.env.SERVER_BASE_PATH}/uploadGJLevel21.php`, uploadLevelHandler)
server.post(`${process.env.SERVER_BASE_PATH}/updateGJDesc20.php`, updateDescHandler)
server.post(`${process.env.SERVER_BASE_PATH}/getGJLevels21.php`, getLevelsHandler)
server.post(`${process.env.SERVER_BASE_PATH}/downloadGJLevel22.php`, downloadLevelHandler)
server.post(`${process.env.SERVER_BASE_PATH}/reportGJLevel.php`, reportLevelHandler)
server.post(`${process.env.SERVER_BASE_PATH}/deleteGJLevelUser20.php`, deleteLevelUserHandler)

server.post(`${process.env.SERVER_BASE_PATH}/uploadGJMessage20.php`, uploadMessageHandler)
server.post(`${process.env.SERVER_BASE_PATH}/getGJMessages20.php`, getMessagesHandler)
server.post(`${process.env.SERVER_BASE_PATH}/downloadGJMessage20.php`, downloadMessageHandler)
server.post(`${process.env.SERVER_BASE_PATH}/deleteGJMessages20.php`, deleteMessagesHandler)

server.post(`${process.env.SERVER_BASE_PATH}/likeGJItem211.php`, likeItemHandler)
server.post(`${process.env.SERVER_BASE_PATH}/getAccountURL.php`, getAccountURLHandler)
server.post(`${process.env.SERVER_BASE_PATH}/requestUserAccess.php`, requestUserAccessHandler)

server.setNotFoundHandler((req, rep) => {
    rep.code(404).send(-1)
})

server.listen({
    port: Number(process.env.SERVER_PORT),
    host: process.env.SERVER_HOST
}, err => {
    if(err) throw err
    Logger.log(`Server now listening at ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
})