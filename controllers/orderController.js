const Product = require("../modals/productScehema");
const Order = require("../modals/ordermodal");
const User = require("../modals/userSchema");
const sendMail = require("../utility/sendMail");

const sendErrorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, error: message });
};

const catchAsyncErrors = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => sendErrorResponse(res, error));
  };
};

//make a order by users


exports.createOrder = catchAsyncErrors(async (req, res) => {
    try {
      // Get order details from the request body
    
      const {
        shippingInfo,
        orderItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
      } = req.body;
  
      // You should also get the userId from your authentication or session
      // Assuming you have it available as userId in your request
  
      const userId = req.user.id; // Assuming you have user authentication middleware
      console.log(userId)
      const newOrder = await Order.create({
        shippingInfo,
        orderItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
        userId: userId,
      });
  
      // No need to call `await newOrder.save()` since you're using `Order.create()` already
  
      console.log(newOrder);
  
      // Return Response with Invoice Link
      res.status(201).json({
        success: true,
        newOrder,
      });
    } catch (error) {
      console.error(error);
    }
});

//get order details by orderid


exports.getOrderDetailById = catchAsyncErrors(async (req, res) => {
    try {
      const orderId = req.params.id; // Use req.params to access the route parameter "id"
  
      const order = await Order.findById(orderId); // Pass the order ID as a string
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order with Order ID not found. Please provide a valid Order ID.",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Order found successfully.",
        order,
      });
    } catch (error) {
      console.error("Error in getOrderDetailById", error);
      res.status(500).json({
        success: false,
        message: "Error while fetching order details.",
      });
    }
});

exports.getUserOrders = catchAsyncErrors(async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using a user object from authentication middleware

    // Find all orders that match the user's ID
    const userOrders = await Order.find({ userId });

    res.status(200).json({
      success: true,
      message: "User's orders retrieved successfully.",
      orders: userOrders,
    });
  } catch (error) {
    console.error("Error in getUserOrders", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching user's orders.",
    });
  }
});