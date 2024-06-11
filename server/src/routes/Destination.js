const express = require('express')
const ItineraryByDate = require('../models/ItineraryByDate')
const Destination = require('../models/Destination')
const { isAuth } = require('../../auth')
const expressAsyncHandler = require('express-async-handler')
const moment = require('moment')
const momentTimezone = require('moment-timezone');
const mongoose = require('mongoose')
const { validationResult, oneOf } = require('express-validator')
const {
    validateUserName,
    validateUserNickName,
    validateUserPassword,
    validateUserEmail,
    validateUserId
} = require('../../validator')

// URL 주소: /api/itinerarys/destination

const router = express.Router()


// 새 목적지 일정 생성
router.post('/create/:itineraryByDateId', [

], isAuth, expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({
            code: 400,
            message: 'Invaild Form data for destination',
            error: errors.array()
        })
    }else{
        const ChangeTimeOfStart = momentTimezone(req.body.timeOfStart).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")
        const ChangeTimeOfEnd = momentTimezone(req.body.timeOfEnd).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")
        // destinationIds 배열에 새로 생성된 destination id값 추가
        const itineraryByDate = await ItineraryByDate.findById(req.params.itineraryByDateId).populate('destinationIds')
        const destination = new Destination({
            title: req.body.title,
            address: req.body.address,
            category: req.body.category,
            timeOfStart: ChangeTimeOfStart,
            timeOfEnd: ChangeTimeOfEnd,
            description: req.body.description,
            cost: req.body.cost,
            destinationInfo: req.body.destinationInfo,
            itineraryId: itineraryByDate.itineraryId,
            itineraryByDateId: itineraryByDate._id
        })
        itineraryByDate.destinationIds.push(destination._id)
        const newDestination = await destination.save()
        itineraryByDate.save()
        if(!newDestination){
            res.status(400).json({code: 400, message: 'Invalid Destination Data'})
        }else{
            const {title, address, category, timeOfStart, timeOfEnd, description, destinationInfo, cost, status} = newDestination

            res.json({
                code: 200,
                title, address, category, timeOfStart, timeOfEnd, description, destinationInfo, cost, status
            })
        }
    }
}))

// 하나의 목적지 내역 가져오기
router.get('/:destinationId', [

], isAuth, expressAsyncHandler(async (req, res, next) => {
    const destination = await Destination.findById(req.params.destinationId)
    if(!destination){
        res.status(404).json({code: 404, message: '해당 일정 내역 없음'})
    }else{
        const {title, address, category, timeOfStart, timeOfEnd, description, destinationInfo, cost, status} = destination
        res.json({code: 200, title, address, category, timeOfStart, timeOfEnd, description, destinationInfo, cost, status})
    }
}))

// 인기 여행지 내역 가져오기
router.get('/list/popularity', expressAsyncHandler(async (req, res, next) => {
    console.log('작동')
    const destinations = await Destination.aggregate([
        {
            $group: {
                _id: {
                    destination: "$destinationInfo.place_id",
                    country: "$destinationInfo.country"
                },
                count: {$sum: 1}
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $group: {
                _id: "$_id.country",
                place: {
                    $push: {
                        destinationId: "$_id.destination",
                        count: "$count"
                    }
                },
                count: {$sum: 1}
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ])
    if(!destinations){
        res.status(404).json({code: 404, message: '여행지 내역 없음'})
    }else{
        res.json({code: 200, destinations})
    }
}))

// 목적지 정보 수정
router.put('/:destinationId', [

], isAuth, expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({
            code: 400,
            message: 'Invaild Form data for destination',
            error: errors.array()
        })
    }else{
        const destination = await Destination.findById(req.params.destinationId)
        // console.log(req.body.timeOfStart)
        // console.log(destination.timeOfStart)
        if(!destination){
            res.status(404).json({code: 404, message: '해당 목적지 내역 없음'})
        }else{
            destination.title = req.body.title || destination.title
            destination.address = req.body.address || destination.address
            destination.category = req.body.category || destination.category
            destination.timeOfStart = req.body.timeOfStart ? momentTimezone(req.body.timeOfStart).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss") : destination.timeOfStart
            destination.timeOfEnd = req.body.timeOfEnd ? momentTimezone(req.body.timeOfEnd).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss") : destination.timeOfEnd
            destination.description = req.body.description || destination.description
            destination.cost = req.body.cost || destination.cost
            destination.destinationInfo = req.body.destinationInfo || destination.destinationInfo
            destination.title = req.body.title || destination.title
            if(req.body.isDone !== undefined){
                destination.isDone = req.body.isDone
            }
            destination.lastModifiedAt = moment()

            const updatedDestination = await destination.save()
            res.json({
                code: 200,
                message: 'Destination updated',
                updatedDestination
            })
        }
    }
}))

// 선택한 목적지 삭제
router.delete('/:itineraryByDateId/:destinationId', isAuth, expressAsyncHandler(async (req, res, next) => {
    const destinationDeleted = await Destination.findByIdAndDelete(req.params.destinationId)
    const itineraryByDate = await ItineraryByDate.findById(req.params.itineraryByDateId)

    const destinationIdsDeleted = itineraryByDate.destinationIds.filter(destinationId => {
        return destinationId.toString() !== req.params.destinationId
    })
    itineraryByDate.destinationIds = destinationIdsDeleted
    itineraryByDate.save()

    if(!destinationDeleted){
        res.status(404).json({code: 404, message: '해당 일정 내역 없음'})
    }else{
        res.status(204).json({code: 204, message: `Destination deleted successfully`})
    }
}))


// 선택한 일차의 목적지 전체 삭제
router.delete('/:itineraryByDateId', isAuth, expressAsyncHandler(async (req, res, next) => {
    console.log(req.params)
    const destinationsDeleted = await Destination.deleteMany({itineraryByDateId: req.params.itineraryByDateId})
    const itineraryByDate = await ItineraryByDate.findById(req.params.itineraryByDateId)
    itineraryByDate.destinationIds = []
    itineraryByDate.save()

    if(!destinationsDeleted){
        res.status(404).json({code: 404, message: '해당 일정 내역 없음'})
    }else{
        res.status(204).json({code: 204, message: 'Destinations deleted successfully'})
    }
}))


module.exports = router