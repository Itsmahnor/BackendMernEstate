import Listing from '../Models/listing.model.js'

import { ErrorHandler } from '../utils/error.js';
export const createListing = async (req, res, next) => {
  try {
    console.log("📩 Incoming Request Body:", req.body);

    const listing = await Listing.create(req.body);

    return res.status(201).json(listing);
  } catch (error) {
    console.error("❌ Error creating listing:", error);

    // 🛑 Handle Duplicate Name Error
    if (error.code === 11000 && error.keyPattern?.name) {
      return res.status(400).json({
        message: 'Listing name already exists. Please choose a unique name.',
      });
    }

    // 🛑 Handle Validation Errors (missing fields, wrong types, etc.)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed.',
        errors: messages,
      });
    }

    // 🛑 Default fallback error
    return res.status(500).json({
      message: 'Something went wrong while creating the listing.',
    });
  }
};

export const getListing = async (req, res, next) => {
  try {
    console.log("✅ Reached getListing");
    console.log("req.user.id:", req.user?.id);
    console.log("req.params.id:", req.params.id);

    if (req.user?.id !== req.params.id) {
      return next(ErrorHandlerHandler(401, "You can only view your own Listing"));
    }

    const list = await Listing.find({ userRef: req.params.id });
    if (!list) {
      return next(ErrorHandler(404, "Listing not found"));
    }

    return res.status(200).json(list);
  } catch (error) {
    console.log("❌ Error in getListing:", error);
    next(error);
  }
};
// In listing.controller.js
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.userRef !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Listing deleted" });
  } catch (err) {
    next(err);
  }
};
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.userRef !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this listing" });
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating listing:", error);
    next(error);
  }
};
export const getSingleListing  = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.userRef !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    return res.status(200).json(listing);
  } catch (error) {
    console.log(" Error fetching single listing:", error);
    next(error);
  }
};


export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const query = {};

    // Apply filters only if true
    if (req.query.offer === 'true') query.offer = true;
    if (req.query.parking === 'true') query.parking = true;
    if (req.query.furnished === 'true') query.furnished = true;

    // Type
    if (req.query.type && req.query.type !== 'all') {
      query.type = req.query.type;
    }

    // Search by name (case-insensitive)
    if (req.query.searchTerm) {
      query.name = { $regex: req.query.searchTerm, $options: 'i' };
    }

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const listings = await Listing.find(query)
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
