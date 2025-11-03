// Script to create a business location for testing
async function createBusinessLocation() {
  try {
    // First, log in as admin
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password',
      }),
    });

    console.log('Login response status:', loginResponse.status);
    
    // Then create a business location
    const locationResponse = await fetch('http://localhost:3000/api/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Business Location',
        code: 'TEST001',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        email: 'info@testbusiness.com',
        baseCurrency: 'USD',
        localCurrency: 'USD',
        isActive: true,
      }),
    });

    console.log('Location response status:', locationResponse.status);
    const locationData = await locationResponse.json();
    console.log('Location data:', locationData);
  } catch (error) {
    console.error('Error creating business location:', error);
  }
}

createBusinessLocation();