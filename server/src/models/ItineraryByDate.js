const mongoose = require('mongoose')
const moment = require('moment')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const ItineraryByDateSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    accommodationName: {
        type: String
    },
    accommodationAddress: {
        type: String
    },
    accommodationCost: {
        type: Number,
        default: 0
    },
    accommodationInfo: {
        type: Object
    },
    itineraryId: {
        type: ObjectId,
        required: true,
        ref: 'Itinerary'
    },
    destinationIds: [{
        type: ObjectId,
        ref: 'Destination',
        default: null
    }],
    createdAt: {
        type: Date,
        default: moment()
    },
    lastModifiedAt: {
        type: Date,
        default: moment()
    }
})


const ItineraryByDate = mongoose.model('ItineraryByDate', ItineraryByDateSchema)
module.exports = ItineraryByDate



// const itineraryByDate = new ItineraryByDate({
//     day: '2일차',
//     date: moment().add(1, "d").startOf("day"),
//     accommodationName: "버고호텔나트랑",
//     accommodationInfo: {
//         "id": "ChIJrYWdl4RncDEROZ6fLWNlw08",
//         "displayName": "버고호텔나트랑",
//         "formattedAddress": "39-41 Nguyễn Thị Minh Khai, Tân Lập, Nha Trang, Khánh Hòa 650000 베트남",
//         "location": {
//             "lat": 12.2381434,
//             "lng": 109.1929615
//         }
//     },
//     destinationId: ['6646fb1225ddd481ffbddfbb', '6646fb3c566937390595fc96']
// })
// itineraryByDate.save().then(() => console.log('itineraryByDate created !'))