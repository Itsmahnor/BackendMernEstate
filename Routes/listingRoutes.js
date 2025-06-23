import express from "express";
import { createListing,getListings,deleteListing,getListing ,getSingleListing,updateListing} from "../Controller/listing.controller.js";
import { VerifyToken } from "../utils/verifieduser.js";

const router = express.Router();

router.post('/create',VerifyToken,createListing)
router.get('/getList/:id',VerifyToken,getListing)
router.delete('/delete/:id',VerifyToken,deleteListing)
router.get('/get',getListings)
router.get('/single/:id', VerifyToken, getSingleListing);
router.put('/update/:id', VerifyToken, updateListing);     

export default router