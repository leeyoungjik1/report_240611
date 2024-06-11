const mongoose = require('mongoose')
const moment = require('moment')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const DestinationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    category: {
        type: String,
        default: '미정'
    },
    timeOfStart: {
        type: Date,
        required: true
    },
    timeOfEnd: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    destinationInfo: {
        type: Object
    },
    cost: {
        type: Number,
        default: 0
    },
    isDone: {
        type: Boolean,
        default: false
    },
    itineraryId: {
        type: ObjectId,
        required: true,
        ref: 'Itinerary'
    },
    itineraryByDateId: {
        type: ObjectId,
        required: true,
        ref: 'ItineraryByDate'
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

DestinationSchema.virtual('status').get(function(){
    return this.isDone ? "완료" : "예정"
})

DestinationSchema.path('category').validate(function(value){
    return /음식점|카페|바|관광명소|쇼핑센터|기타|미정/.test(value)
}, 'category `{VALUE}` 는 유효하지 않은 카테고리입니다.')

const Destination = mongoose.model('Destination', DestinationSchema)
module.exports = Destination



// const destination = new Destination({
//     title: '식당 가기',
//     address: '주소지',
//     category: '음식점',
//     timeOfStart: moment(),
//     timeOfEnd: moment().add(7, "h"),
//     description: '음식점 가기',
//     destinationInfo: {
//         "name": "버고호텔나트랑",
//         "address": "39-41 Nguyễn Thị Minh Khai, Tân Lập, Nha Trang, Khánh Hòa 650000 베트남",
//         "location": {
//             "lat": 12.2381434,
//             "lng": 109.1929615
//         },
//         "photoUrl": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUGGfZn1gW9dVHFuG0R4igvQPd9k0oDAR1aWOWlpidk_DJUZf36d315_lLHLxSjmgTv5lkHlveR8C3vojIc9cSGzsXK-q4a2A3ZYOLxdecK39SywdYuSNfJlzD2mYr_E9zZtEs9bbos0M05NfhXIpG5-TrEcXB_kGnMesG7LRrRrPBurymaO&3u3000&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A3000%2Fitinerary%2Fdetails%2F664d8c573a6b0b9f5fb15455&key=AIzaSyC7aPamGSCDt9s5iw0Pl3Tx35R2zUVFs8I&token=22289",
//         "place_id": "ChIJrYWdl4RncDEROZ6fLWNlw08"
//     }
// })
// destination.save().then(() => console.log('destination created !'))