const Category = require('../models/categoryModel');
const { createCategorySchema, updateCategorySchema } = require('../middlewares/validator');

// Create a new category
exports.createCategory = async (req, res) => {
    const { name } = req.body;

    try {
        // Validate the input data
        const { error } = createCategorySchema.validate({ name });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name: name.toLowerCase() });
        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: 'Category already exists'
            });
        }

        // Create new category
        const newCategory = new Category({ name: name.toLowerCase() });
        const savedCategory = await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category: savedCategory
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating category'
        });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories', details: error.message });
  }
};

// Get a specific category by id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching category', details: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;

    try {
        // Validate input
        const { error } = updateCategorySchema.validate({ name });
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: error.details.map(detail => detail.message).join(', ')
            });
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name: name.toLowerCase() }, { new: true, runValidators: true });
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: 'Error updating category' });
    }
};

exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Optional: handle the removal of this category from related documents if needed
        // This will depend on your application logic

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            category: deletedCategory
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Error deleting category' });
    }
};