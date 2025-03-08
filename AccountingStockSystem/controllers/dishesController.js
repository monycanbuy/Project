const mongoose = require("mongoose");
const Dish = require("../models/dishesModel");
const Category = require("../models/categoryModel");
const AnotherUnifiedSale = require("../models/anotherUnifiedSaleModel");
const {
  createDishSchema,
  updateDishSchema,
} = require("../middlewares/validator");

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find()
      .populate("category", "name")
      .populate("ingredients.inventoryItem", "name"); // Populate both category and ingredients
    res.json(dishes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching dishes", details: error.message });
  }
};

// Create a new dish
// exports.createDish = async (req, res) => {
//   const { name, description, price, category, ingredients } = req.body;

//   try {
//     // Validate the input data
//     const { error } = createDishSchema.validate({
//       name,
//       description,
//       price,
//       category,
//       ingredients,
//     });
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details[0].message,
//       });
//     }

//     // Find the category by name
//     const categoryDoc = await Category.findOne({ name: category });
//     if (!categoryDoc) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Category not found" });
//     }

//     // Create the dish
//     const newDish = new Dish({
//       name,
//       description,
//       price,
//       category: categoryDoc._id,
//       ingredients: ingredients.map((ingredient) => ({
//         inventoryItem: ingredient.inventoryItem,
//         quantity: ingredient.quantity,
//       })),
//     });
//     const savedDish = await newDish.save();
//     res.status(201).json({
//       success: true,
//       message: "Dish created successfully",
//       dish: savedDish,
//     });
//   } catch (error) {
//     console.error("Error creating dish:", error);
//     res.status(500).json({ success: false, message: "Error creating dish" });
//   }
// };

exports.createDish = async (req, res) => {
  try {
    // 1. Validate using Joi *FIRST*, with abortEarly: false
    const { error, value } = createDishSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessages, // Send back *all* validation errors
      });
    }

    const { name, description, price, category, ingredients } = value; // Use validated 'value'

    // 2. Find the category by its _id (which is a string now)
    const categoryDoc = await Category.findById(category); // Use findById
    if (!categoryDoc) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }

    // 3. Create the dish, passing the category ID
    const newDish = new Dish({
      name,
      description,
      price,
      category: categoryDoc._id, // Pass the ObjectId of the category
      ingredients: ingredients.map((ingredient) => ({
        inventoryItem: ingredient.inventoryItem, //This should be an objectId
        quantity: ingredient.quantity,
      })),
    });

    const savedDish = await newDish.save();
    res.status(201).json({
      success: true,
      message: "Dish created successfully",
      dish: savedDish,
    });
  } catch (error) {
    console.error("Error creating dish:", error);
    res.status(500).json({ success: false, message: "Error creating dish" });
  }
};

// Update a dish (soft update)
// exports.updateDish = async (req, res) => {
//   const { dishId } = req.params;
//   const { name, description, price, category, ingredients } = req.body;

//   try {
//     // Validate input, removing categoryName as we now use only category (name)
//     const { error } = updateDishSchema.validate({
//       name,
//       description,
//       price,
//       category,
//       ingredients,
//     });
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details[0].message,
//       });
//     }

//     // Find the category by name
//     let categoryId = null;
//     if (category) {
//       // If category is provided (as a name now)
//       const foundCategory = await Category.findOne({ name: category });
//       if (!foundCategory) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Category not found" });
//       }
//       categoryId = foundCategory._id;
//     }

//     // Prepare update fields - this will only update the dish's own properties, not linked items like sales
//     const updateFields = {
//       ...(name !== undefined && { name }),
//       ...(description !== undefined && { description }),
//       ...(price !== undefined && { price }),
//       ...(categoryId !== null && { category: categoryId }),
//       ...(ingredients && {
//         ingredients: ingredients.map((ingredient) => ({
//           inventoryItem: ingredient.inventoryItem,
//           quantity: ingredient.quantity,
//         })),
//       }),
//     };

//     // Soft update: changes in dish do not affect past sales or inventory quantities used in those sales
//     const updatedDish = await Dish.findByIdAndUpdate(dishId, updateFields, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedDish) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Dish not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Dish updated successfully",
//       dish: updatedDish,
//     });
//   } catch (error) {
//     console.error("Error updating dish:", error);
//     res.status(500).json({ success: false, message: "Error updating dish" });
//   }
// };
exports.updateDish = async (req, res) => {
  const { dishId } = req.params;

  try {
    // 1. Validate using Joi, with abortEarly: false
    const { error, value } = updateDishSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessages,
      });
    }

    const { name, description, price, category, ingredients } = value; // Destructure from validated value

    // 2. Find the existing dish
    const existingDish = await Dish.findById(dishId);
    if (!existingDish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    // 3. Find the category by ID (if a category is provided)
    let categoryId = null;
    if (category) {
      // Check if the provided category is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category ID" });
      }

      const categoryDoc = await Category.findById(category); // Find by ID!
      if (!categoryDoc) {
        return res
          .status(400)
          .json({ success: false, message: "Category not found" });
      }
      categoryId = categoryDoc._id; // Get the ObjectId
    }

    // 4. Build the update object *conditionally*
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = price;
    if (categoryId !== null) updateFields.category = categoryId; // Use the ObjectId
    if (ingredients !== undefined) {
      updateFields.ingredients = ingredients.map((ingredient) => ({
        inventoryItem: ingredient.inventoryItem,
        quantity: ingredient.quantity,
      }));
    }

    // 5. Update the dish
    const updatedDish = await Dish.findByIdAndUpdate(dishId, updateFields, {
      new: true,
      runValidators: true,
    })
      .populate("category") // Populate category for response
      .populate("ingredients.inventoryItem"); // Populate inventory items for response

    if (!updatedDish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    res.status(200).json({
      success: true,
      message: "Dish updated successfully",
      dish: updatedDish,
    });
  } catch (error) {
    console.error("Error updating dish:", error);
    res.status(500).json({ success: false, message: "Error updating dish" });
  }
};

// Delete a dish
exports.deleteDish = async (req, res) => {
  const { dishId } = req.params;

  try {
    const deletedDish = await Dish.findByIdAndDelete(dishId);
    if (!deletedDish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    // Here, you might want to consider what happens to sales or inventory linked to this dish.
    // For a soft delete, you might just mark the dish as inactive instead of fully removing it.
    res.status(200).json({
      success: true,
      message: "Dish deleted successfully",
      dish: deletedDish,
    });
  } catch (error) {
    console.error("Error deleting dish:", error);
    res.status(500).json({ success: false, message: "Error deleting dish" });
  }
};
