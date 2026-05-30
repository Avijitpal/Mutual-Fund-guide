const Fund = require('../models/Fund');
const { fetchAllFunds, fetchFundDetails, calculateReturns } = require('../services/mfApiService');

// POST - Seed database with real API data using an optimized concurrent batching queue
exports.seedFunds = async (req, res, next) => {
  try {
    console.log('🌱 Starting database seeding process...');
    const allFunds = await fetchAllFunds();
    
    // Grab the first 100 funds for our application catalog
    const sampleFunds = allFunds.slice(0, 100); 
    const BATCH_SIZE = 10;
    let savedCount = 0;

    // Process our dataset in optimized chunks of 10 concurrently
    for (let i = 0; i < sampleFunds.length; i += BATCH_SIZE) {
      const currentBatch = sampleFunds.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch indices ${i} to ${i + currentBatch.length}...`);

      await Promise.all(currentBatch.map(async (fund) => {
        try {
          const details = await fetchFundDetails(fund.schemeCode);
          if (!details || !details.data || details.data.length === 0) return;

          const latestNavRecord = details.data[0];
          const calculatedYields = calculateReturns(details.data);

          // Generate highly realistic institutional metrics to fill the data gaps from the free API
          const mockExpenseRatio = parseFloat((Math.random() * (2.2 - 0.2) + 0.2).toFixed(2)); // 0.2% to 2.2%
          const mockRisk = ['Low', 'Moderate', 'High', 'Very High'][Math.floor(Math.random() * 4)];
          const mockAum = Math.floor(Math.random() * (45000 - 450) + 450); // 450Cr to 45,000Cr

          // Atomic upsert operation: dynamically update existing matching scheme records or insert new ones
          await Fund.findOneAndUpdate(
            { schemeCode: fund.schemeCode },
            {
              schemeCode: fund.schemeCode,
              schemeName: fund.schemeName,
              fundHouse: details.meta?.fund_house || 'Independent Fund House',
              category: details.meta?.scheme_category?.includes('Equity') ? 'Equity' :
                        details.meta?.scheme_category?.includes('Debt') ? 'Debt' : 'Hybrid',
              subCategory: details.meta?.scheme_category || 'Growth Scheme',
              nav: parseFloat(latestNavRecord?.nav || 0),
              navDate: new Date(latestNavRecord?.date?.split('-').reverse().join('-') || Date.now()), // Normalize dd-mm-yyyy to ISO
              returns: calculatedYields,
              expenseRatio: mockExpenseRatio,
              riskLevel: mockRisk,
              aum: mockAum
            },
            { upsert: true, new: true }
          );
          savedCount++;
        } catch (singleFundError) {
          console.error(`⚠️ Skipping scheme ${fund.schemeCode} due to network friction:`, singleFundError.message);
        }
      }));
    }

    res.json({ 
      success: true, 
      message: `Database seeding completed successfully! Populated ${savedCount} funds concurrently.` 
    });
  } catch (error) {
    // If our system hits a roadblock, send it straight to our Express runtime error processor
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET all funds (Temporary mock wrapper to test connectivity tomorrow)
exports.getAllFunds = async (req, res) => {
  try {
    const funds = await Fund.find({}).limit(100);
    res.json({ success: true, count: funds.length, data: funds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    GET single fund details by ID
// @route   GET /api/funds/:id
exports.getFundById = async (req, res, next) => {
  try {
    const fund = await Fund.findById(req.params.id);
    
    if (!fund) {
      res.statusCode = 404;
      throw new Error('Mutual Fund profile not found in database registry');
    }
    
    res.json({ success: true, data: fund });
  } catch (error) {
    next(error); // Pass the exception to your secure global error middleware
  }
};

// @desc    GET chronological historical fund NAV metrics from external API
// @route   GET /api/funds/:id/history
exports.getFundHistory = async (req, res, next) => {
  try {
    const fund = await Fund.findById(req.params.id);
    if (!fund) {
      res.statusCode = 404;
      throw new Error('Mutual Fund profile not found');
    }

    // Call your external API helper using the scheme code stored in the fund document
    const history = await fetchFundDetails(fund.schemeCode);
    
    if (!history) {
      res.statusCode = 424;
      throw new Error('Failed to retrieve historical pricing data from external supplier');
    }

    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};