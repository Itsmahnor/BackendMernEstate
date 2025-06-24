import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  regularPrice: {
    type: Number,
    required: [true, 'Regular price is required'],
  },
  discountPrice: {
    type: Number,
    required: [true, 'Discount price is required'],
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
  },
  furnished: {
    type: Boolean,
    required: [true, 'Furnished field is required'],
  },
  parking: {
    type: Boolean,
    required: [true, 'Parking field is required'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
  },
  offer: {
    type: Boolean,
    required: [true, 'Offer field is required'],
  },
  imageUrls: {
    type: Array,
    required: [true, 'At least one image is required'],
  },
  userRef: {
    type: String,
    required: [true, 'User reference is required'],
  },
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
