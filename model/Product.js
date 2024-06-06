//product schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    ID: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    // TypeofGold: {
    //   type: String,
    //   required: true,
    // },
    Description: {
      type: String,
      required: true,
    },
    TotalWeight: {
      type: Number,
      required: true,
    },
    // GoldWeight: {
    //   type: Number,
    //   ref: "Category",
    //   required: true,
    // },
    KlHot: {
      type: Number,
      required: true,
    },
    tienCong: {
      type: Number,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },


    // price: {
    //   type: Number,
    //   required: true,
    // },

    // totalQty: {
    //   type: Number,
    //   required: true,
    // },
    // totalSold: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
//Virtuals
//qty left
ProductSchema.virtual("GoldWeight").get(function(){
  const product = this;
  return product.TotalWeight - product.KlHot;
});
// //qty left
// ProductSchema.virtual("GoldWeight").get(function(){
//   const product = this;
//   return product.TotalWeight - product.KlHot;
// });
// //Total rating
// ProductSchema.virtual("totalReveiws").get(function () {
//   const product = this;
//   return product?.reviews?.length;
// });
// //average Rating
// ProductSchema.virtual("averageRating").get(function () {
//   let ratingTotal = 0;
//   const product = this;
//   product?.reviews?.forEach((review) => {
//     ratingTotal += review?.rating;
//   });
//   //calc average rating
//   const averageRating = Number(ratingTotal / product?.reviews?.length).toFixed(1);
//   return averageRating;
// });

const Product = mongoose.model("Product", ProductSchema);

export default Product;