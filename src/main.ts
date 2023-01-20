import fastify from 'fastify'
import formbody from '@fastify/formbody'
import dotenv from 'dotenv'
dotenv.config()

import registerHandler from './features/accounts/registerAccount'
import loginHandler from './features/accounts/loginAccount'

import updateScoreHandler from './features/users/updateScore'
import getUserInfoHandler from './features/users/getUserInfo'
import getUsersHandler from './features/users/getUsers'
import updateUserSettingsHandler from './features/users/updateUserSettings'

import uploadAccComment from './features/comments/uploadAccComment'
import getAccComments from './features/comments/getAccComments'
import deleteAccComment from './features/comments/deleteAccComment'

import createFriendRequestHandler from './features/friends/uploadFriendRequest'
import removeFriendRequestHandler from './features/friends/removeFriendRequest'
import getFriendRequestsHandler from './features/friends/getFriendRequests'
import blockUserHandler from './features/friends/blockUser'

import likeItemHandler from './features/misc/likeItem'

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

server.post(`${process.env.SERVER_BASE_PATH}/likeGJItem211.php`, likeItemHandler)

server.listen({
    port: Number(process.env.SERVER_PORT),
    host: process.env.SERVER_HOST
}, err => {
    if(err) throw err
    console.log(`Server now listening at ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
})