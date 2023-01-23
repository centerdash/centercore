import fastify from 'fastify'
import formbody from '@fastify/formbody'
import dotenv from 'dotenv'
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
import uploadAccComment from './features/comments/uploadAccComment'
import getAccComments from './features/comments/getAccComments'
import deleteAccComment from './features/comments/deleteAccComment'

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

server.post(`${process.env.SERVER_BASE_PATH}/getGJAccountComments20.php`, getAccComments)
server.post(`${process.env.SERVER_BASE_PATH}/uploadGJAccComment20.php`, uploadAccComment)
server.post(`${process.env.SERVER_BASE_PATH}/deleteGJAccComment20.php`, deleteAccComment)

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
    console.log(`Server now listening at ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
})