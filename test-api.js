// test-api.js - Updated with correct table name
const fetch = require('node-fetch');

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ndW9peXd1enR6d3Ric3lkbGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODUwODcsImV4cCI6MjA2NjM2MTA4N30.4ebyfoNtE180ir1vQ28T2gDAoJQVM2pFK4KZ8TSHXeI';

async function testAPI() {
  try {
    console.log('🔄 Testing with correct table name...');
    
    // Try "Equipment" (capital E)
    const response = await fetch('https://mguoiywuztzwtbsydliw.supabase.co/rest/v1/Equipment', {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Found equipment data:', data);
    } else {
      console.log('❌ Still error:', response.status);
      const errorData = await response.text();
      console.log('Error:', errorData);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAPI();