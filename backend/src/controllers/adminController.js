import User from "../models/user.js";
import Profile from "../models/Profile.js";

export const getAdminStats = async (req, res) => {
  try {
    // Total users count
    const totalUsers = await User.countDocuments({ role: "user" });
    
    // Total NGOs count
    const totalNgos = await User.countDocuments({ role: "ngo" });
    
    // Get all profiles with location data
    const profiles = await Profile.find({}).populate("user", "name email createdAt");
    
    // Active states (states with users)
    const stateMap = {};
    profiles.forEach(profile => {
      const location = profile.data?.location || profile.data?.state;
      if (location) {
        stateMap[location] = (stateMap[location] || 0) + 1;
      }
    });
    
    const activeStates = Object.keys(stateMap).length;
    const stateAnalytics = Object.entries(stateMap).map(([state, count]) => ({
      state,
      count
    }));
    
    // Extract skills from all profiles
    const skillMap = {};
    profiles.forEach(profile => {
      const skills = profile.data?.skills;
      if (skills) {
        const skillArray = typeof skills === 'string' ? skills.split(',') : skills;
        if (Array.isArray(skillArray)) {
          skillArray.forEach(skill => {
            const cleanSkill = skill.trim().toLowerCase();
            if (cleanSkill) {
              skillMap[cleanSkill] = (skillMap[cleanSkill] || 0) + 1;
            }
          });
        }
      }
    });
    
    // Top skills sorted by count
    const topSkills = Object.entries(skillMap)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: Math.round((count / profiles.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await User.countDocuments({
      role: "user",
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // User growth by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userGrowth = await User.aggregate([
      {
        $match: {
          role: "user",
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalNgos,
        activeStates,
        recentUsers,
        stateAnalytics,
        topSkills,
        userGrowth,
        lastUpdated: new Date()
      }
    });
    
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUsersList = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    
    const query = { role: "user" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    const users = await User.find(query)
      .select("name email createdAt isVerified")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getNgosList = async (req, res) => {
  try {
    const ngos = await User.find({ role: "ngo" })
      .select("name email createdAt")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: ngos
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
