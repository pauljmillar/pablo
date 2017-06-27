 // load the things we need
var mongoose = require('mongoose'), Schema = mongoose.Schema;

// define the schema for our klass model
var klassAssignmentGroupSchema = mongoose.Schema({

        klassId      :  {type: Schema.Types.ObjectId, ref: 'Klass'},
        assignmentGroupId      :  {type: Schema.Types.ObjectId, ref: 'AssignmentGroup'},
        enabled           : {type: Boolean, default: true}
        }  , {
            timestamps : true                                    
        });

klassAssignmentGroupSchema.index({klassId: 1, assignmentGroupId: 1}, {unique: true});

// create the model for users and expose it to our app
module.exports = mongoose.model('KlassAssignmentGroup', klassAssignmentGroupSchema);