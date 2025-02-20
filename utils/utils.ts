/**
 * Formats a property object to match the TListingCard type
 * @param {Object} property - The property object to format
 * @returns {Object} - A formatted object matching the TListingCard type
 */
export function formatPropertyToListingCard(property: any) {
  // Find the main image URL
  const mainImageUrl = property.photos.find(photo => photo.isMain)?.url || 
                       (property.photos.length > 0 ? property.photos[0].url : '');

  // Determine the category
  let category = property.category;
  if (category === 'FLAT') {
    category = 'Appartement';
  } else if (category === 'VILLA') {
    category = 'Villa';
  }

  // Return formatted object
  return {
    userReference : property.userReference,
    adress: {
      main: property.address.main,
      street: property.address.street,
      neighborhood: property.address.neighborhood,
      city: property.address.city,
      country: property.address.country,
      zipCode: property.address.zipCode,
      location: property.address.location,
    },
    rooms : property.rooms,
    area: property.area,
    bathrooms: property.bathrooms,
    category: category, 
    price: {
      global: property.price.global,
    },
    transactionType: property.transactionType,
    image: mainImageUrl
  };
}

/**
 * Formats an amount in Dirhams with space separators
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted amount with 'Dh' suffix
 */
export function formatAmount(amount) {
    // Convert to number if it's a string with 'DH' suffix
    if (typeof amount === 'string') {
      amount = amount.replace(/dh|DH/i, '').trim();
    }
    
    // Convert to number and handle invalid inputs
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return 'Invalid amount';
    }
    
    // Format with spaces as thousand separators
    const formattedAmount = numAmount.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    // Return with 'Dh' suffix
    return `${formattedAmount} Dh`;
  }

  export function calculateMonthlyPayment(price: number, years = 25) {
    const monthlyPayement = price / (years * 12);
     return monthlyPayement.toFixed(2);
     }