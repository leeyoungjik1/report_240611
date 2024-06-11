const express = require('express')
const User = require('../models/User')
const Itinerary = require('../models/Itinerary')
const ItineraryByDate = require('../models/ItineraryByDate')
const Destination = require('../models/Destination')
const { isAuth } = require('../../auth')
const expressAsyncHandler = require('express-async-handler')
const moment = require('moment')
const momentTimezone = require('moment-timezone')
const mongoose = require('mongoose')
const { validationResult, oneOf } = require('express-validator')
const {
    validateUserName,
    validateUserNickName,
    validateUserPassword,
    validateUserEmail,
    validateUserId
} = require('../../validator')
const itineraryByDateRouter = require('./ItineraryByDate')
const destinationRouter = require('./Destination')

// URL 주소: /api/itinerarys

const router = express.Router()
router.use('/bydate', itineraryByDateRouter)
router.use('/destination', destinationRouter)

// 새 일정 생성
router.post('/create', [

], isAuth, expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({
            code: 400,
            message: 'Invaild Form data for itinerary',
            error: errors.array()
        })
    }else{
        const ChangeDateOfStart = momentTimezone(req.body.dateOfStart).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")
        const ChangeDateOfEnd = momentTimezone(req.body.dateOfEnd).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")
        const itinerary = new Itinerary({
            userId: req.body.userId,
            title: req.body.title,
            city: req.body.city,
            dateOfStart: ChangeDateOfStart,
            dateOfEnd: ChangeDateOfEnd,
            description: req.body.description,
            isPublic: req.body.isPublic
        })
        const newItinerary = await itinerary.save()
        if(!newItinerary){
            res.status(400).json({code: 400, message: 'Invalid Itinerarys Data'})
        }else{
            const {userId, title, city, dateOfStart, dateOfEnd, description, open, _id} = newItinerary
            
            res.json({
                code: 200,
                userId, title, city, dateOfStart, dateOfEnd, description, open, _id
            })
        }
    }
}))

// 해당 사용자 전체 일정 리스트 가져오기
router.get('/list', [

], isAuth, expressAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)

    let itinerarys = null
    if(req.query.filter === 'schedule'){
        if(req.query.sort === 'lastModifiedAt'){
            itinerarys = await Itinerary.find({isDone: false, userId: user})
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }else{
            itinerarys = await Itinerary.find({isDone: false, userId: user})
            .sort({dateOfStart: 1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }
    }else if(req.query.filter === 'completion'){
        if(req.query.sort === 'lastModifiedAt'){
            itinerarys = await Itinerary.find({isDone: true, userId: user})
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }else{
            itinerarys = await Itinerary.find({isDone: true, userId: user})
            .sort({dateOfStart: 1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }
    }else{
        if(req.query.sort === 'lastModifiedAt'){
            itinerarys = await Itinerary.find({userId: user})
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }else{
            itinerarys = await Itinerary.find({userId: user})
            .sort({dateOfStart: 1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }
    }
    if(itinerarys.length === 0){
        res.status(404).json({code: 404, message: '사용자의 일정 내역 없음'})
    }else{
        const result = itinerarys.map((itinerary) => {
            const {city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, status, open, isDone, lastModifiedAt} = itinerary
            return {city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, status, open, isDone, lastModifiedAt}
        })
        res.json({code: 200, Itinerarys: result})
    }
}))

// 해당 사용자 검색된 전체 일정 리스트 가져오기
router.get('/list/searched', [

], isAuth, expressAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)

    let itinerarys = null
    if(req.query.isDone === 'schedule'){
        if(req.query.searchFilter === 'title'){
            itinerarys = await Itinerary.find({
                userId: user,
                isDone: false,
                title: {$regex: new RegExp(req.query.searchWord)}
            })
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }else if(req.query.searchFilter === 'city'){
            itinerarys = await Itinerary.find({
                userId: user,
                isDone: false,
                city: {$regex: new RegExp(req.query.searchWord)}
            })
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }else{
            itinerarys = await Itinerary.find({
                userId: user,
                isDone: false,
            })
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }
    }else if(req.query.isDone === 'completion'){
        if(req.query.searchFilter === 'title'){
            itinerarys = await Itinerary.find({
                userId: user,
                isDone: true,
                title: {$regex: new RegExp(req.query.searchWord)}
            })
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }else if(req.query.searchFilter === 'city'){
            itinerarys = await Itinerary.find({
                userId: user,
                isDone: true,
                city: {$regex: new RegExp(req.query.searchWord)}
            })
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }else{
            itinerarys = await Itinerary.find({
                userId: user,
                isDone: true,
            })
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }
    }else{
        if(req.query.searchFilter === 'title'){
            itinerarys = await Itinerary.find({
                userId: user,
                title: {$regex: new RegExp(req.query.searchWord)}
            })
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }else if(req.query.searchFilter === 'city'){
            itinerarys = await Itinerary.find({
                userId: user,
                city: {$regex: new RegExp(req.query.searchWord)}
            })
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }else{
            itinerarys = await Itinerary.find({
                userId: user,
            })
            .sort({lastModifiedAt: -1})
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }
    }

    if(itinerarys.length === 0){
        res.status(404).json({code: 404, message: '사용자의 일정 내역 없음'})
    }else{
        const result = itinerarys.map((itinerary) => {
            const {city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, status, open, isDone, lastModifiedAt} = itinerary
            return {city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, status, open, isDone, lastModifiedAt}
        })
        res.json({code: 200, Itinerarys: result})
    }
}))



// 해당 일정 전체 예상 비용 가져오기
router.get('/totalcost/:itineraryId', [

], expressAsyncHandler(async (req, res, next) => {
    const accommodationCosts = await ItineraryByDate.aggregate([
        {$match: {itineraryId: new mongoose.Types.ObjectId(req.params.itineraryId)}},
        {$group: {
            _id: "$itineraryId",
            total: {$sum: "$accommodationCost"}
        }}
    ])
    const destinationCosts = await Destination.aggregate([
        {$match: {itineraryId: new mongoose.Types.ObjectId(req.params.itineraryId)}},
        {$group: {
            _id: "$itineraryId",
            total: {$sum: "$cost"}
        }}
    ])

    let accommodationCost = 0
    let destinationCost = 0
    if(accommodationCosts.length !== 0){
        accommodationCost = accommodationCost + accommodationCosts[0].total
    }
    if(destinationCosts.length !== 0){
        destinationCost = destinationCost + destinationCosts[0].total
    }

    let totalcost = accommodationCost + destinationCost

    // console.log(totalcost)
    res.json({code: 200, totalcost})
}))


// 선택한 일정 수정
router.put('/changelist/:itineraryId', [

], isAuth, expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({
            code: 400,
            message: 'Invaild Form data for itinerary',
            error: errors.array()
        })
    }else{
        const user = await User.findById(req.user._id)
        const itinerary = await Itinerary.findOne({_id: req.params.itineraryId, userId: user})
        .populate({
            path: 'itineraryByDateIds',
            populate: {path: 'destinationIds'}
        })
        // console.log(itinerary)
        if(!itinerary){
            res.status(404).json({code: 404, message: '해당 일정 내역 없음'})
        }else{
            itinerary.title = req.body.title || itinerary.title
            itinerary.city = req.body.city || itinerary.city
            itinerary.dateOfStart = req.body.dateOfStart ? momentTimezone(req.body.dateOfStart).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss") : itinerary.dateOfStart
            itinerary.dateOfEnd = req.body.dateOfEnd ? momentTimezone(req.body.dateOfEnd).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss") : itinerary.dateOfEnd
            itinerary.description = req.body.description || itinerary.description
            itinerary.isPublic = req.body.isPublic || itinerary.isPublic
            if(req.body.isDone !== undefined){
                itinerary.isDone = req.body.isDone
            }
            itinerary.lastModifiedAt = moment()

            const updatedItinerary = await itinerary.save()
            res.json({
                code: 200,
                message: 'Itinerary updated',
                updatedItinerary
            })
        }
    }
}))

// 선택한 일정 삭제
router.delete('/changelist/:itineraryId', isAuth, expressAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    const itinerary = await Itinerary.findOneAndDelete({_id: req.params.itineraryId, userId: user})
    // console.log(itinerary)
    if(!itinerary){
        res.status(404).json({code: 404, message: '해당 일정 내역 없음'})
    }else{
        const itineraryByDate = await ItineraryByDate.deleteMany({itineraryId: req.params.itineraryId})
        const destination = await Destination.deleteMany({itineraryId: req.params.itineraryId})
        res.status(204).json({code: 204, message: 'Itinerary deleted successfully'})
    }
}))


// 선택한 일정 하나의 내역 가져오기
router.get('/details/:itineraryId', [

], isAuth, expressAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    const itinerary = await Itinerary.findOne({_id: req.params.itineraryId, userId: user})
    .populate({
        path: 'itineraryByDateIds',
        options: { sort: { 'date': 1 } },
        populate: {
            path: 'destinationIds',
            options: { sort: { 'timeOfStart': 1 } }
        }
    })
    // console.log(itinerary)
    const accommodationCosts = await ItineraryByDate.aggregate([
        {$match: {itineraryId: new mongoose.Types.ObjectId(req.params.itineraryId)}},
        {$group: {
            _id: "$itineraryId",
            total: {$sum: "$accommodationCost"}
        }}
    ])
    const destinationCosts = await Destination.aggregate([
        {$match: {itineraryId: new mongoose.Types.ObjectId(req.params.itineraryId)}},
        {$group: {
            _id: "$itineraryId",
            total: {$sum: "$cost"}
        }}
    ])

    let totalcost = 0
    if(accommodationCosts.total && destinationCosts.total && accommodationCosts.length !== 0 || destinationCosts.length !== 0){
        totalcost = accommodationCosts[0].total + destinationCosts[0].total
    }

    if(!itinerary){
        res.status(404).json({code: 404, message: '해당 일정 내역 없음'})
    }else{
        const {city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, isPublic, status, open} = itinerary
        res.json({code: 200, city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, isPublic, status, open, totalcost})
    }
}))


// 선택한 일정 중 하나의 일차 내역 가져오기
router.get('/details/ItineraryByDate/:itineraryId/:ItineraryByDate', [

], isAuth, expressAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    const itinerary = await Itinerary.findOne({_id: req.params.itineraryId, userId: user})
    .populate({
        path: 'itineraryByDateIds',
        match: { _id: new mongoose.Types.ObjectId(req.params.ItineraryByDate) },
        options: { sort: { 'date': 1 } },
        populate: {
            path: 'destinationIds',
            options: { sort: { 'timeOfStart': 1 } }
        }
    })

    const accommodationCosts = await ItineraryByDate.aggregate([
        {$match: {itineraryId: new mongoose.Types.ObjectId(req.params.itineraryId)}},
        {$group: {
            _id: "$itineraryId",
            total: {$sum: "$accommodationCost"}
        }}
    ])
    const destinationCosts = await Destination.aggregate([
        {$match: {itineraryId: new mongoose.Types.ObjectId(req.params.itineraryId)}},
        {$group: {
            _id: "$itineraryId",
            total: {$sum: "$cost"}
        }}
    ])

    let totalcost = 0
    if(accommodationCosts.total && destinationCosts.total && accommodationCosts.length !== 0 || destinationCosts.length !== 0){
        totalcost = accommodationCosts[0].total + destinationCosts[0].total
    }

    if(!itinerary){
        res.status(404).json({code: 404, message: '해당 일정 내역 없음'})
    }else{
        const {city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, isPublic, status, open} = itinerary
        res.json({code: 200, city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, isPublic, status, open, totalcost})
    }
}))


// 모든 사용자의 공개된 전체 일정 리스트 가져오기
router.get('/sharedlist', [

], expressAsyncHandler(async (req, res, next) => {
    const itinerarys = await Itinerary.find({isPublic: true})
    .sort({lastModifiedAt: -1})
    .populate('userId')
    .populate({
        path: 'itineraryByDateIds',
        populate: {path: 'destinationIds'}
    })

    if(itinerarys.length === 0){
        res.status(404).json({code: 404, message: '공개된 일정 내역 없음'})
    }else{
        const result = itinerarys.map((itinerary) => {
            const {userId, city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, status, open, isDone, lastModifiedAt} = itinerary
            return {userId, city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, status, open, isDone, lastModifiedAt}
        })
        res.json({code: 200, Itinerarys: result})
    }
}))

// 모든 사용자의 공개된 일정 중 검색된 전체 일정 리스트 가져오기
router.get('/list/sharedlist/searched', [

], expressAsyncHandler(async (req, res, next) => {
    let itinerarys = null
    if(req.query.searchFilter === 'title'){
        itinerarys = await Itinerary.find({
            title: {$regex: new RegExp(req.query.searchWord)}
        })
        .sort({lastModifiedAt: -1})
        .populate('userId')
        .populate({
            path: 'itineraryByDateIds',
            populate: {path: 'destinationIds'}
        })
    }else if(req.query.searchFilter === 'city'){
        itinerarys = await Itinerary.find({
            city: {$regex: new RegExp(req.query.searchWord)}
        })
        .sort({lastModifiedAt: -1})
        .populate('userId')
        .populate({
            path: 'itineraryByDateIds',
            populate: {path: 'destinationIds'}
        })
    }
    else if(req.query.searchFilter === 'nickName'){
        const users = await User.find({
            nickName: {$regex: new RegExp(req.query.searchWord)}
        })
        if(users){
            itinerarys = await Itinerary.find({
                userId: {$in: users.map(user => user._id)}
            })
            .sort({lastModifiedAt: -1})
            .populate('userId')
            .populate({
                path: 'itineraryByDateIds',
                populate: {path: 'destinationIds'}
            })
        }
    }
    else{
        itinerarys = await Itinerary.find()
        .sort({lastModifiedAt: -1})
        .populate('userId')
        .populate({
            path: 'itineraryByDateIds',
            populate: {path: 'destinationIds'}
        })
    }
    
    if(itinerarys.length === 0){
        res.status(404).json({code: 404, message: '사용자의 일정 내역 없음'})
    }else{
        const result = itinerarys.map((itinerary) => {
            const {userId, city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, status, open, isDone, lastModifiedAt} = itinerary
            return {userId, city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, status, open, isDone, lastModifiedAt}
        })
        res.json({code: 200, Itinerarys: result})
    }
}))

// 선택한 공개 일정 하나의 내역 가져오기
router.get('/details/sharedlist/:itineraryId', [

], expressAsyncHandler(async (req, res, next) => {
    const itinerary = await Itinerary.findById(req.params.itineraryId)
    .populate({
        path: 'itineraryByDateIds',
        options: { sort: { 'date': 1 } },
        populate: {
            path: 'destinationIds',
            options: { sort: { 'timeOfStart': 1 } }
        }
    })
    // console.log(itinerary)
    const accommodationCosts = await ItineraryByDate.aggregate([
        {$match: {itineraryId: new mongoose.Types.ObjectId(req.params.itineraryId)}},
        {$group: {
            _id: "$itineraryId",
            total: {$sum: "$accommodationCost"}
        }}
    ])
    const destinationCosts = await Destination.aggregate([
        {$match: {itineraryId: new mongoose.Types.ObjectId(req.params.itineraryId)}},
        {$group: {
            _id: "$itineraryId",
            total: {$sum: "$cost"}
        }}
    ])

    let totalcost = 0
    if(accommodationCosts.total && destinationCosts.total && accommodationCosts.length !== 0 || destinationCosts.length !== 0){
        totalcost = accommodationCosts[0].total + destinationCosts[0].total
    }

    if(!itinerary){
        res.status(404).json({code: 404, message: '해당 일정 내역 없음'})
    }else{
        const {city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, isPublic, status, open} = itinerary
        res.json({code: 200, city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, isPublic, status, open, totalcost})
    }
}))

// 선택한 공개 일정 중 하나의 일차 내역 가져오기
router.get('/details/sharedlist/ItineraryByDate/:itineraryId/:ItineraryByDate', [

], expressAsyncHandler(async (req, res, next) => {
    const itinerary = await Itinerary.findById(req.params.itineraryId)
    .populate({
        path: 'itineraryByDateIds',
        match: { _id: new mongoose.Types.ObjectId(req.params.ItineraryByDate) },
        options: { sort: { 'date': 1 } },
        populate: {
            path: 'destinationIds',
            options: { sort: { 'timeOfStart': 1 } }
        }
    })

    const accommodationCosts = await ItineraryByDate.aggregate([
        {$match: {itineraryId: new mongoose.Types.ObjectId(req.params.itineraryId)}},
        {$group: {
            _id: "$itineraryId",
            total: {$sum: "$accommodationCost"}
        }}
    ])
    const destinationCosts = await Destination.aggregate([
        {$match: {itineraryId: new mongoose.Types.ObjectId(req.params.itineraryId)}},
        {$group: {
            _id: "$itineraryId",
            total: {$sum: "$cost"}
        }}
    ])

    let totalcost = 0
    if(accommodationCosts.total && destinationCosts.total && accommodationCosts.length !== 0 || destinationCosts.length !== 0){
        totalcost = accommodationCosts[0].total + destinationCosts[0].total
    }

    if(!itinerary){
        res.status(404).json({code: 404, message: '해당 일정 내역 없음'})
    }else{
        const {city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, isPublic, status, open} = itinerary
        res.json({code: 200, city, dateOfEnd, dateOfStart, description, itineraryByDateIds, title, _id, isPublic, status, open, totalcost})
    }
}))

module.exports = router