#!/usr/bin/env node

/**
 * Simple test to debug the 401 issue on production
 */

const PRODUCTION_URL = 'https://phorent-gz5dvb258-gilang-gunawan-saputras-projects.vercel.app'

async function debugProductionAccess() {
  console.log('🔍 Debugging Production Access')
  console.log('='.repeat(50))
  
  console.log('🌐 Testing basic connectivity to:', PRODUCTION_URL)
  
  try {
    // Test 1: Basic homepage access
    console.log('\n📋 Test 1: Homepage access')
    const homeResponse = await fetch(PRODUCTION_URL)
    console.log('Status:', homeResponse.status)
    console.log('Headers:', Object.fromEntries(homeResponse.headers.entries()))
    
    // Test 2: API route access (GET request)
    console.log('\n📋 Test 2: API route GET request')
    const apiGetResponse = await fetch(`${PRODUCTION_URL}/api/auth/register`)
    console.log('Status:', apiGetResponse.status)
    console.log('Headers:', Object.fromEntries(apiGetResponse.headers.entries()))
    
    if (apiGetResponse.status === 405) {
      console.log('✅ API route exists (405 = Method Not Allowed for GET)')
    }
    
    // Test 3: API route access (POST request with minimal data)
    console.log('\n📋 Test 3: API route POST request (minimal)')
    const apiPostResponse = await fetch(`${PRODUCTION_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
    console.log('Status:', apiPostResponse.status)
    console.log('Headers:', Object.fromEntries(apiPostResponse.headers.entries()))
    
    let responseBody = ''
    try {
      responseBody = await apiPostResponse.text()
      console.log('Response body length:', responseBody.length)
      console.log('Response body preview:', responseBody.substring(0, 200))
    } catch (e) {
      console.log('Could not read response body:', e.message)
    }
    
  } catch (error) {
    console.error('🔥 Error during testing:', error.message)
  }
}

// Run the debug test
debugProductionAccess()
