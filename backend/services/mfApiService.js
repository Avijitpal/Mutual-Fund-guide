const axios = require('axios');

// Fetch the base registry list of all listed mutual funds
const fetchAllFunds = async () => {
  try {
    const response = await axios.get('https://api.mfapi.in/mf');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching master fund registry:', error.message);
    return [];
  }
};

// Fetch real-time metadata and complete chronological NAV records for a specific scheme
const fetchFundDetails = async (schemeCode) => {
  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching fund data for code ${schemeCode}:`, error.message);
    return null;
  }
};

// Compute historic returns by looking back at the raw historical NAV arrays
const calculateReturns = (navData) => {
  if (!navData || navData.length < 2) return {};

  const latestNav = parseFloat(navData[0].nav);
  
  const getReturnPercentage = (daysAgo) => {
    // If historical records don't stretch back far enough, gracefully return 0
    if (navData.length <= daysAgo) return 0;
    const historicalNav = parseFloat(navData[daysAgo].nav);
    if (historicalNav === 0) return 0;
    
    return parseFloat((((latestNav - historicalNav) / historicalNav) * 100).toFixed(2));
  };

  return {
    oneMonth: getReturnPercentage(30),
    threeMonth: getReturnPercentage(90),
    sixMonth: getReturnPercentage(180),
    oneYear: getReturnPercentage(365),
    threeYear: getReturnPercentage(1095),
    fiveYear: getReturnPercentage(1825),
  };
};

module.exports = { fetchAllFunds, fetchFundDetails, calculateReturns };