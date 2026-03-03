const express = require('express');
const router = express.Router();

router.post('/platforms', async (req, res) => {
  const { career, careerType } = req.body;
  const q = encodeURIComponent(career);
  const slug = career.toLowerCase().replace(/\s+/g, '-');

  const allPlatforms = [
    // Local / Blue collar
    {
      name: 'Apna App',
      url: `https://apna.co/jobs?query=${q}`,
      type: 'local',
      tip: 'Hindi mein local jobs — seedha search karo aur apply karo',
      forTypes: ['local', 'traditional'],
      isLink: true
    },
    {
      name: 'WorkIndia',
      url: `https://www.workindia.in/job-search?search=${q}`,
      type: 'local',
      tip: 'Blue collar jobs, Hindi support — free mein register karo',
      forTypes: ['local', 'traditional'],
      isLink: true
    },
    {
      name: 'JustDial',
      url: `https://www.justdial.com/${slug}-jobs`,
      type: 'local',
      tip: 'Apne sheher ke local employers ko directly call karo',
      forTypes: ['local', 'traditional'],
      isLink: true
    },
    {
      name: 'Urban Company',
      url: `https://professionals.urbancompany.com/register`,
      type: 'local',
      tip: 'Beauty, cooking, cleaning — professional registration karo aur kaam pao',
      forTypes: ['local', 'traditional'],
      isLink: true
    },
    // Reselling / Gig
    {
      name: 'Meesho',
      url: `https://supplier.meesho.com/registration`,
      type: 'freelance',
      tip: 'Seller registration — free mein shuru karo, koi investment nahi chahiye',
      forTypes: ['freelance', 'local'],
      isLink: true
    },
    // WhatsApp — tip card (no link)
    {
      name: 'WhatsApp Tip',
      url: null,
      type: 'freelance',
      tip: `Apne 10 contacts ko WhatsApp pe message karo: "Main ${career} ka kaam karti hoon, koi kaam ho toh batana." Pehla customer wahi se milega!`,
      forTypes: ['freelance', 'local'],
      isLink: false,
      isTip: true
    },
    // Professional / Digital
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/jobs/search/?keywords=${q}`,
      type: 'full-time',
      tip: 'Professional jobs — profile banao aur apply karo',
      forTypes: ['professional', 'full-time'],
      isLink: true
    },
    {
      name: 'Upwork',
      url: `https://www.upwork.com/freelancer/registration`,
      type: 'freelance',
      tip: 'International clients — free registration, profile banao',
      forTypes: ['freelance', 'professional'],
      isLink: true
    },
    {
      name: 'Fiverr',
      url: `https://www.fiverr.com/start_selling`,
      type: 'freelance',
      tip: 'Apni service list karo aur orders pao — bilkul free',
      forTypes: ['freelance', 'professional'],
      isLink: true
    },
  ];

  let filtered;
  if (!careerType || careerType === 'any') {
    filtered = allPlatforms.filter(p => ['local', 'freelance'].includes(p.type));
  } else if (careerType === 'freelance') {
    filtered = allPlatforms.filter(p => p.forTypes.includes('freelance'));
  } else if (careerType === 'traditional') {
    filtered = allPlatforms.filter(p => p.forTypes.includes('traditional') || p.forTypes.includes('local'));
  } else if (careerType === 'professional') {
    filtered = allPlatforms.filter(p => p.forTypes.includes('professional'));
  } else {
    filtered = allPlatforms.filter(p => p.type === 'local' || p.type === 'freelance');
  }

  res.json({ platforms: filtered });
});

module.exports = router;