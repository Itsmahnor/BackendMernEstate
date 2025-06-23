import Listing from '../Models/listing.model.js';
import User from '../Models/user.model.js';
import ErrorHandler from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const { name, description, address, regularPrice, discountPrice, bedrooms, furnished, parking, type, offer, imageUrls, userRef } = req.body;

    if (!imageUrls?.length || !userRef) {
      return res.status(400).json({ message: "Missing images or userRef" });
    }

    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    console.error("❌ createListing error:", error);
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    if (req.user?.id !== req.params.id) {
      return next(ErrorHandler(401, "You can only view your own listings"));
    }

    const list = await Listing.find({ userRef: req.params.id });
    if (!list) return next(ErrorHandler(404, "No listings found"));

    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.userRef !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted" });
  } catch (err) {
    next(err);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.userRef !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this listing" });
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update error:", error);
    next(error);
  }
};

export const getSingleListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.userRef !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const query = {};
    if (req.query.offer === 'true') query.offer = true;
    if (req.query.parking === 'true') query.parking = true;
    if (req.query.furnished === 'true') query.furnished = true;
    if (req.query.type && req.query.type !== 'all') query.type = req.query.type;
    if (req.query.searchTerm) {
      query.name = { $regex: req.query.searchTerm, $options: 'i' };
    }

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const listings = await Listing.find(query)
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
