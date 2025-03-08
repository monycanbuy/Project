const FrontOfficeSale = require('../models/frontOfficeModel'); // Adjust path as needed
const { createFrontOfficeSaleSchema,updateFrontOfficeSaleSchema } = require('../middlewares/validator');
const mongoose = require('mongoose');

// Get all front office sales
exports.getAllFrontOfficeSales = async (req, res) => {
    try {
        const sales = await FrontOfficeSale.find().sort({ date: -1 }); // Sort by date, newest first
        res.status(200).json({
            success: true,
            sales
        });
    } catch (error) {
        console.error('Error fetching front office sales:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching front office sales'
        });
    }
};

// Get a front office sale by ID
exports.getFrontOfficeSaleById = async (req, res) => {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid sale ID'
        });
    }

    try {
        const sale = await FrontOfficeSale.findById(id);
        if (!sale) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found'
            });
        }

        res.status(200).json({
            success: true,
            sale
        });
    } catch (error) {
        console.error('Error fetching front office sale by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching front office sale'
        });
    }
};

exports.createFrontOfficeSale = async (req, res) => {
    try {
      console.log('Incoming Request Body:', req.body); // Debugging
      const { error } = createFrontOfficeSaleSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details.map((detail) => detail.message).join(', '),
        });
      }
  
      req.body.assignedPersonnel = req.user?.fullName || 'Unknown User';
  
      const newSale = new FrontOfficeSale(req.body);
      await newSale.save();
  
      res.status(201).json({
        success: true,
        message: 'Front Office sale reported successfully',
        sale: newSale,
      });
    } catch (error) {
      console.error('Error reporting Front Office sale:', error);
      res.status(500).json({
        success: false,
        message: 'Error reporting Front Office sale',
      });
    }
  };   

exports.updateFrontOfficeSale = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate that the sale ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Sale ID is required',
            });
        }

        // Validate the request body using the schema
        const { error } = updateFrontOfficeSaleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(detail => detail.message).join(', '),
            });
        }

        // Update assignedPersonnel dynamically using JWT payload (if updating assignedPersonnel is required)
        if (!req.body.assignedPersonnel) {
            req.body.assignedPersonnel = req.user?.fullName || 'Unknown User';
        }

        // Find and update the sale document
        const updatedSale = await FrontOfficeSale.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        );

        // If sale is not found
        if (!updatedSale) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found',
            });
        }

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Front Office sale updated successfully',
            sale: updatedSale,
        });
    } catch (error) {
        console.error('Error updating Front Office sale:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating Front Office sale',
        });
    }
};