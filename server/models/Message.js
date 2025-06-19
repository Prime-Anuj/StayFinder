const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
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
            filename: String
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
    }
}, {
    timestamps: true
});

// Indexes
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ recipient: 1 });

module.exports = mongoose.model('Message', messageSchema);