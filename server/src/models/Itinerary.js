const mongoose = require('mongoose')
const moment = require('moment')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const itinerarySchema = new Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        default: '여행 일정'
    },
    city: {
        type: String
    },
    dateOfStart: {
        type: Date,
        required: true
    },
    dateOfEnd: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    itineraryByDateIds: [{
        type: ObjectId,
        ref: 'ItineraryByDate',
        default: null
    }],
    isDone: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: moment()
    },
    lastModifiedAt: {
        type: Date,
        default: moment()
    }
})

itinerarySchema.virtual('status').get(function(){
    return this.isDone ? "완료" : "예정"
})
itinerarySchema.virtual('open').get(function(){
    return this.isPublic ? "공개" : "비공개"
})

const Itinerary = mongoose.model('Itinerary', itinerarySchema)
module.exports = Itinerary


// const itinerary = new Itinerary({
//     userId: '664c33a830e0ea803931bd77',
//     city: '안산',
//     dateOfStart: moment().startOf("day"),
//     dateOfEnd: moment().add(1, "d").startOf("day"),
//     description: '안산 여행 가기',
//     itineraryByDateIds: ['6646fc2752dca9a8bf487d8c', '6646ff2515b0647b5abedc49']
// })
// itinerary.save().then(() => console.log('itinerary created !'))