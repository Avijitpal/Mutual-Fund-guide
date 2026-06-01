const Portfolio = require('../models/Portfolio');
const Fund = require('../models/Fund');
const redisClient = require('../config/redis'); // Ensure your Redis configuration is imported

// 🛒 Buy a Fund (Mock Paper Trading)
exports.buyFund = async (req, res) => {
  try {
    const { fundId, amount, type } = req.body; // type: 'LUMP_SUM' or 'SIP'
    const userId = req.user.id; 

    const fund = await Fund.findById(fundId);
    if (!fund) return res.status(404).json({ success: false, error: 'Target mutual fund record not found.' });

    const currentNav = fund.nav;
    const investmentAmount = Number(amount); // Force explicit numerical casting
    const unitsAcquired = investmentAmount / currentNav;

    // Find existing asset record or initialize a fresh model
    let holding = await Portfolio.findOne({ user: userId, fund: fundId });

    if (!holding) {
      holding = new Portfolio({
        user: userId,
        fund: fundId,
        totalUnits: 0,
        totalInvested: 0
      });
    }

    // Append transaction log entry
    holding.transactions.push({
      type,
      purchaseNav: currentNav,
      unitsAcquired,
      investedAmount: investmentAmount
    });

    // Recalculate consolidated metrics
    holding.totalUnits += unitsAcquired;
    holding.totalInvested += investmentAmount;

    if (type === 'SIP') {
      holding.isAutoSipActive = true;
      holding.sipAmount = investmentAmount;
    }

    await holding.save();

    // ⚡ REDIS CACHE INVALIDATION: Wipe out the old cached portfolio for this user
    try {
      const cacheKey = `funds_list_/api/portfolio/summary`;
      await redisClient.del(cacheKey);
      console.log('🧹 Stale portfolio data evicted from Redis Cache Cloud.');
    } catch (cacheErr) {
      console.error('Non-blocking cache eviction fault:', cacheErr);
    }

    res.status(201).json({ success: true, holding });
  } catch (error) {
    console.error('Portfolio Transaction Error:', error);
    res.status(500).json({ success: false, error: 'Failed to complete mock asset acquisition.' });
  }
};

// 📈 Fetch User Portfolio with Real-Time P&L Tracking
exports.getUserPortfolio = async (req, res) => {
  try {
    // Populate rich mutual fund telemetry right into the portfolio data stream
    const assets = await Portfolio.find({ user: req.user.id }).populate('fund');

    let totalPortfolioValue = 0;
    let totalPortfolioInvestment = 0;

    const portfolioSummary = assets.map(asset => {
      // Guard against orphaned or missing fund records in development
      if (!asset.fund) return null;

      const currentMarketPrice = asset.fund.nav || 0;
      const currentValuation = asset.totalUnits * currentMarketPrice;
      const netProfitLoss = currentValuation - asset.totalInvested;
      
      // 🛡️ Safe Calculation: Defend against Division-by-Zero errors converting to NaN
      const absoluteReturnPercentage = asset.totalInvested > 0 
        ? (netProfitLoss / asset.totalInvested) * 100 
        : 0;

      totalPortfolioValue += currentValuation;
      totalPortfolioInvestment += asset.totalInvested;

      return {
        holdingId: asset._id,
        schemeName: asset.fund.schemeName,
        category: asset.fund.category,
        totalUnits: asset.totalUnits,
        totalInvested: asset.totalInvested,
        currentValue: currentValuation,
        pnl: netProfitLoss,
        returnsPercentage: absoluteReturnPercentage,
        sipStatus: {
          isActive: asset.isAutoSipActive,
          amount: asset.sipAmount
        }
      };
    }).filter(item => item !== null); // Strip out unmapped anomalies gracefully

    const totalPnL = totalPortfolioValue - totalPortfolioInvestment;
    const totalPnLPercentage = totalPortfolioInvestment > 0 ? (totalPnL / totalPortfolioInvestment) * 100 : 0;

    res.json({
      success: true,
      summary: {
        currentPortfolioValue: totalPortfolioValue,
        totalInvestedCapital: totalPortfolioInvestment,
        overallPnL: totalPnL,
        overallReturnsPercentage: totalPnLPercentage
      },
      holdings: portfolioSummary
    });
  } catch (error) {
    console.error('P&L Engine Compilation Failure:', error);
    res.status(500).json({ success: false, error: 'Failed to compile financial valuation summaries.' });
  }
};

// 🛑 Toggle/Deactivate Automated SIP
exports.toggleSipStatus = async (req, res) => {
  try {
    const { holdingId } = req.body;
    const holding = await Portfolio.findOne({ _id: holdingId, user: req.user.id });

    if (!holding) return res.status(404).json({ success: false, error: 'Investment target holding not found.' });

    holding.isAutoSipActive = !holding.isAutoSipActive;
    await holding.save();

    // ⚡ Clear cache here as well so the status state remains identical everywhere
    try {
      await redisClient.del(`funds_list_/api/portfolio/summary`);
    } catch (e) {}

    res.json({ success: true, isAutoSipActive: holding.isAutoSipActive });
  } catch (error) {
    console.error('SIP Toggle Fault:', error);
    res.status(500).json({ success: false, error: 'Failed to update system SIP schedule configurations.' });
  }
};