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
    adress: {
      main: property.address.main,
      street: property.address.street,
      neighborhood: property.address.neighborhood,
      city: property.address.city,
      country: property.address.country,
      zipCode: property.address.zipCode,
      location: property.address.location,
    },
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