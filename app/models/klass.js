// load the things we need
var mongoose = require('mongoose'), Schema = mongoose.Schema;

// define the schema for our klass model
var klassSchema = mongoose.Schema({

        name        : String,
        shortDesc   : String,
        longDesc    : String,
        teacherId   : {type: Schema.Types.ObjectId, ref: 'User'},
        username    : String, 
        numStudents : { type: Number, default: 0},
        joinCode    : String,
        pointsOn    : { type: Boolean, default: true},
        klassNum    : { type: Number, default: 0}
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Klass', klassSchema);