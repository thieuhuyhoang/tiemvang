import express from "express";
import { 
    createProductCtrl, 
    getProductsCrtl, 
    getProductCrtl,
    updateProductCrtl,
    deleteProductCrtl
} from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const productsRouter = express.Router();

productsRouter.post("/", isLoggedIn, createProductCtrl );
productsRouter.get("/", getProductsCrtl );
productsRouter.get("/:id", getProductCrtl );
productsRouter.put("/:id", isLoggedIn,updateProductCrtl );
productsRouter.delete("/:id/delete", isLoggedIn,deleteProductCrtl );

export default productsRouter;