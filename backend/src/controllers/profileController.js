// controllers/profileController.js

import Student from "../models/Student.js";
import Professional from "../models/Professional.js";
import Worker from "../models/Worker.js";

export const saveProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { role, data } = req.body;

    let profile;

    if (role === "student") {
      profile = await Student.create({ ...data, user: userId });
    }

    else if (role === "professional") {
      profile = await Professional.create({ ...data, user: userId });
    }

    else if (role === "worker") {
      profile = await Worker.create({ ...data, user: userId });
    }

    return res.status(201).json({
      success: true,
      message: "Profile saved",
      profile,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};