const cron = require('node-cron');
const Portfolio = require('../models/Portfolio');
const Fund = require('../models/Fund');

// Schedule tasks to fire at 00:00 midnight on the 1st day of every month
const initSipAutomationEngine = () => {
  cron.schedule('0 0 1 * *', async () => {
    console.log('🤖 SIP Automation Engine Active: Processing recurring monthly deductions...');
    try {
      // Find all investments across the platform with active automated monthly schedules
      const activeSips = await Portfolio.find({ isAutoSipActive: true });

      for (let holding of activeSips) {
        const fund = await Fund.findById(holding.fund);
        if (!fund) continue;

        const currentNav = fund.nav;
        const deductionAmount = holding.sipAmount;
        const newlyAcquiredUnits = deductionAmount / currentNav;

        // Inject automated transaction entry log
        holding.transactions.push({
          type: 'SIP',
          purchaseNav: currentNav,
          unitsAcquired: newlyAcquiredUnits,
          investedAmount: deductionAmount
        });

        // Mutate absolute master records
        holding.totalUnits += newlyAcquiredUnits;
        holding.totalInvested += deductionAmount;

        await holding.save();
        console.log(`✅ SIP Processed: Allocated ${newlyAcquiredUnits.toFixed(4)} units for Fund ID: ${holding.fund}`);
      }
      console.log('🏁 Monthly automated processing loop finished successfully.');
    } catch (error) {
      console.error('CRITICAL: SIP Automation System hit a processing lock:', error);
    }
  });
};

module.exports = { initSipAutomationEngine };