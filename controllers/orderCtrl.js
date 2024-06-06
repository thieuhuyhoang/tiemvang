import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import dotenv from "dotenv";
dotenv.config();
import User from "../model/User.js";
import Product from "../model/Product.js";



//@desc create orders
//@route POST /api/v1/orders
//@access private

//stripe instance
// const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOderCtrl = asyncHandler(async (req, res)=>{
   

   //get discount
  //  const discount = couponFound?.discount / 100;
   
   //Get the payload(customer, orderItem,ShippingAddress, totalPrice)
   const {orderItems, shippingAddress, totalPrice } = req.body;
   // console.log({
   //    orderItems,
   //    shippingAddress,
   //    totalPrice,
   // });
   //Find the user
   const user = await User.findById(req.userAuthId);
   //Check if user has shipping address
  //  if(!user?.hasShippingAddress){
  //     throw new Error("Please provide shipping address");
  //  }
   //Check if order is not empty
   if(orderItems?.length <=0){
      throw new Error("No order Items");
   }
   //Place/create order - Save into DB
   const order = await Order.create({
      user: user?._id,
      orderItems,
      shippingAddress,
      // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
      totalPrice
   });
   //console.log(order);
   //Update the product qty
   const products = await Product.find({_id:{$in:orderItems}});
   
   orderItems?.map(async(order)=>{
      const product = products?.find((product)=>{
         return product?._id?.toString() === order?._id?.toString();
      });
      if(product){
         product.totalSold += order.qty;
      }
      await product.save();
   });
   //push order into user
   user.orders.push(order?._id);
   await user.save();
   //make payment (stripe)
   //convert order items to have same structure that stripe need
   const convertedOrders = orderItems.map((item) => {
      return {
         price_data: {
            currency: "usd",
            product_data: {
               name: item?.name,
               description: item?.description,
            },
            unit_amount: item?.price * 100,
         },
         quantity: item?.qty,
      };
   });
  //  const session = await stripe.checkout.sessions.create({
  //     line_items: convertedOrders,
  //     metadata: {
  //        orderId: JSON.stringify(order?.id),
  //     },
  //     mode: "payment",
  //     // success_url: "http://localhost:3000/success",
  //     // cancel_url: "http://localhost:3000/cancel",
  //     success_url: "https://ecommerce-frontend-uit.vercel.app/success",
  //     cancel_url: "https://ecommerce-frontend-uit.vercel.app/cancel",
  //  });
   res.send({ url: session.url });
   //payment webhook
   //update the user order
   // res.json({
   //    success: true,
   //    message: "Order created",
   //    order,
   //    user,
   // })
});

//@desc get all orders
//@route GET /api/v1/orders
//@access private

export const getAllordersCtrl = asyncHandler(async (req, res) => {
   //find all orders
   const orders = await Order.find().populate("user");
   //const orders = await Order.find();
   res.json({
     success: true,
     message: "All orders",
     orders,
   });
 });

//@desc get single order
//@route GET /api/v1/orders/:id
//@access private/admin

// export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
//    //get the id from params
//    const id = req.params.id;
//    const order = await Order.findById(id);
//    //send response
//    res.status(200).json({
//      success: true,
//      message: "Single order",
//      order,
//    });
//  });

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

// export const updateOrderCtrl = asyncHandler(async (req, res) => {
//    //get the id from params
//    const id = req.params.id;
//    //update
//    const updatedOrder = await Order.findByIdAndUpdate(
//      id,
//      {
//        status: req.body.status,
//      },
//      {
//        new: true,
//      }
//    );
//    res.status(200).json({
//      success: true,
//      message: "Order updated",
//      updatedOrder,
//    });
//  });

 //@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

// export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
//    //get order stats
   
//   //  const orders = await Order.aggregate([
//   //    {
//   //      $group: {
//   //        _id: null,
//   //        minimumSale: {
//   //          $min: "$totalPrice",
//   //        },
//   //        totalSales: {
//   //          $sum: "$totalPrice",
//   //        },
//   //        maxSale: {
//   //          $max: "$totalPrice",
//   //        },
//   //        avgSale: {
//   //          $avg: "$totalPrice",
//   //        },
//   //      },
//   //    },
//   //  ]);
//    // //get the date
//    const date = new Date();
//    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//    const saleToday = await Order.aggregate([
//      {
//        $match: {
//          createdAt: {
//            $gte: today,
//          },
//        },
//      },
//      {
//        $group: {
//          _id: null,
//          totalSales: {
//            $sum: "$totalPrice",
//          },
//        },
//      },
//    ]);
//    // //send response
//    res.status(200).json({
//      success: true,
//      message: "Sum of orders",
//      orders,
//      saleToday,
//    });
//  });