// utils/discountPolicy.js
const Dish = require('../models/dishesModel');

const applyDiscount = async (sale, saleItems) => {
    let totalDiscount = 0;
    let newTotalAmount = sale.totalAmount;

    // Check for sale-wide discount based on total amount
    if (newTotalAmount >= 100) {
        const discountPercentage = 10; // 10% discount
        const discountAmount = (newTotalAmount * discountPercentage) / 100;
        totalDiscount += discountAmount;
        newTotalAmount -= discountAmount;
    }

    // Check for item-specific discounts
    for (const item of saleItems) {
        const dish = await Dish.findById(item.dish);

        if (dish && dish.name === 'Special Dish') { // Example condition for a specific dish
            const itemDiscountPercentage = 20; // 20% off for this dish
            const itemDiscount = (item.totalAmount * itemDiscountPercentage) / 100;
            item.discount = itemDiscount; // Save item-specific discount
            totalDiscount += itemDiscount;
            newTotalAmount -= itemDiscount;
        }
    }

    // Update the sale with discount info
    sale.discount = totalDiscount / sale.totalAmount * 100; // Convert to percentage for storage
    sale.discountedTotal = newTotalAmount;

    return { sale, saleItems };
};

module.exports = { applyDiscount };