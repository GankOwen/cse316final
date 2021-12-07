const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail:{type: String, required:true},
        author : {type : String, required : true},
        commentAuthors : {type:[String], required : false},
        date : {type:String, require:false},
        likeNumber : {type:Number, require:true},
        dislikeNumber : {type:Number, require:true},
        comments:{type:[String], require:false},
        ifPublished:{type: Boolean, require: true},
        viewNumber:{type:Number, require:true},
        userLikeList:{type:[String], require:true},
        userDislikeList:{type:[String], require:true},
        userName: { type: String, required: true },
        sortingDate:{type:String, require:false}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
