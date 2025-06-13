const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        text: {
            type: String,
            maxlength: [2000, 'Message cannot exceed 2000 characters']
        },
        attachments: [{
            type: {
                type: String,
                enum: ['image', 'document', 'link']
            },
            url: String,
            filename: String,
            size: Number
        }]
    },
    messageType: {
        type: String,
        enum: ['text', 'booking_request', 'booking_confirmation', 'system'],
        default: 'text'
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Indexes
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ recipient: 1 });

module.exports = mongoose.model('Message', messageSchema);
