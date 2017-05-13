// load the things we need
var mongoose = require('mongoose'), Schema = mongoose.Schema;

// define the schema for our klass model
var assignmentGroupAssignmentSchema = mongoose.Schema({

        assignmentGroupId      :  {type: Schema.Types.ObjectId, ref: 'AssignmentGroup'},
        assignmentId      :  {type: Schema.Types.ObjectId, ref: 'Assignment'},
        enabled           : {type: Boolean, default: true}
        }  , {
            timestamps : true                                    
        });

assignmentGroupAssignmentSchema.index({assignmentGroupId: 1, assignmentId: 1}, {unique: true});

// create the model for users and expose it to our app
module.exports = mongoose.model('AssignmentGroupAssignment', assignmentGroupAssignmentSchema);