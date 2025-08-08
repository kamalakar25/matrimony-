const express = require('express');
const router = express.Router();
const Report = require('../modals/reportSchema');

// POST route to submit a report
router.post('/report-profile', async (req, res) => {
  try {
    console.log('Received report request:', req.body);
    const { reportingUserId, reportedProfileId, reason, category, message } = req.body;

    // Validate required fields
    if (!reportingUserId || !reportedProfileId || !reason || !category || !message) {
      console.log('Validation failed:', { reportingUserId, reportedProfileId, reason, category, message });
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate enum values
    const validReasons = ['spam', 'inappropriate-content', 'fake-profile', 'harassment', 'other'];
    const validCategories = ['message', 'profile', 'behaviour', 'photos'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ error: `Invalid reason. Must be one of: ${validReasons.join(', ')}` });
    }
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
    }

    // Validate reported profile exists
    const profile = await Profile.findById(reportedProfileId);
    if (!profile) {
      return res.status(404).json({ error: 'Reported profile not found' });
    }

    // Create new report
    const newReport = new Report({
      reportingUserId,
      reportedProfileId,
      reason,
      category,
      message,
      createdAt: new Date(),
    });

    // Save report to database
    await newReport.save();
    console.log('Report saved successfully:', newReport);

    res.status(201).json({ 
      message: 'Report submitted successfully',
      report: {
        id: newReport._id,
        reportingUserId,
        reportedProfileId,
        reason,
        category,
        message,
        createdAt: newReport.createdAt,
      }
    });
  } catch (error) {
    console.error('Error submitting report:', error.message, error.stack);
    res.status(500).json({ error: `Failed to submit report: ${error.message}` });
  }
});
module.exports = router;