// load the things we need
var mongoose = require('mongoose'), Schema = mongoose.Schema;

// define the schema for our klass model
var assignmentGroupSchema = mongoose.Schema({

        name        : String,
        description : String,
        lesson      : String,
        isCustom    : { type: Boolean, default: false},
        isPublic    : { type: Boolean, default: true},
        icon        : String,
        createdById  :  {type: Schema.Types.ObjectId, ref: 'User'},
});


// create the model for users and expose it to our app
module.exports = mongoose.model('AssignmentGroup', assignmentGroupSchema);