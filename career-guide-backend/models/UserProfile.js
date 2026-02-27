const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },

  // Basic info — onboarding se aata hai
  name: String,
  age: String,
  education: {
    type: String,
    enum: ['padha nahi', '5th tak', '10th tak', '12th/college', null],
    default: null
  },
  digitalLiteracy: { type: Boolean, default: null },  // smartphone use kar sakti hain?
  englishLevel: {
    type: String,
    enum: ['bilkul nahi', 'thoda', 'achha', null],
    default: null
  },

  // Preferences
  preferredLanguage: {
    type: String,
    enum: ['hindi', 'tamil', 'telugu', 'marathi', 'english'],
    default: 'hindi'
  },
  workPreference: {
    type: String,
    enum: ['remote', 'offline', 'both'],
    default: 'both'
  },
  hoursPerDay: { type: Number, default: 2 },
  interests: String,
  transcript: String,

  profileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);