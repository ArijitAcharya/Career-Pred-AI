// Simple API test script
import { authApi } from './services/authApi'
import { predictionsApi } from './services/predictionsApi'
import { analyticsApi } from './services/analyticsApi'
import { tokenStorage } from './services/storage'

async function testAPI() {
  console.log('=== API Test Started ===')
  
  // Test 1: Check authentication
  console.log('1. Testing authentication...')
  try {
    const loginRes = await authApi.login({ 
      email: 'test@example.com', 
      password: 'testpass123' 
    })
    console.log('✅ Login successful:', loginRes.data)
    tokenStorage.setAccess(loginRes.data.access)
    tokenStorage.setRefresh(loginRes.data.refresh)
  } catch (e) {
    console.error('❌ Login failed:', e.response?.data || e.message)
    return
  }
  
  // Test 2: Check predictions API
  console.log('2. Testing predictions API...')
  try {
    const historyRes = await predictionsApi.history()
    console.log('✅ History API successful:', historyRes.data)
  } catch (e) {
    console.error('❌ History API failed:', e.response?.data || e.message)
  }
  
  // Test 3: Check analytics API
  console.log('3. Testing analytics API...')
  try {
    const analyticsRes = await analyticsApi.getOverview()
    console.log('✅ Analytics API successful:', analyticsRes.data)
  } catch (e) {
    console.error('❌ Analytics API failed:', e.response?.data || e.message)
  }
  
  console.log('=== API Test Complete ===')
}

testAPI()
