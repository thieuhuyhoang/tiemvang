import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createOderCtrl,
        } from "../controllers/orderCtrl.js";

const orderRouter = express.Router();
orderRouter.post('/', isLoggedIn, createOderCtrl);
// orderRouter.get('/', isLoggedIn, getAllordersCtrl);
// orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);
// orderRouter.put('/update/:id', isLoggedIn, updateOrderCtrl);
// orderRouter.get('/:id', isLoggedIn, getSingleOrderCtrl);
export default orderRouter;

