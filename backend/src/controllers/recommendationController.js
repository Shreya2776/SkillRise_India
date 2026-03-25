import Opportunity from "../models/opportunity.model.js";
import Program from "../models/program.model.js";
import Profile from "../models/Profile.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

// @desc    Get AI-powered recommendations for the user
// @route   GET /api/recommendations
export const getRecommendations = async (req, res) => {
  try {
    let userRole = "Professional";
    let userSkills = [];
    
    // 1. Fetch Profile from DB to get the true baseline
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile && profile.data) {
       userRole = profile.data.jobTitle || profile.data.headline || profile.role || userRole;
       if (profile.data.skills) {
           const skillsRaw = profile.data.skills;
           let pSkills;
           if (typeof skillsRaw === "string") {
              pSkills = skillsRaw.split(",").map(s => s.trim().toLowerCase());
           } else if (Array.isArray(skillsRaw)) {
              pSkills = skillsRaw.map(s => s.toLowerCase());
           } else {
              pSkills = [];
           }
           userSkills = [...pSkills];
       }
    }
    
    // 2. Merge with query skills (from Resume Analyzer)
    if (req.query.skills) {
      const qSkills = req.query.skills.split(",").map(s => s.trim().toLowerCase());
      userSkills = [...new Set([...userSkills, ...qSkills])];
    }
    
    // Fetch ops and programs
    const [ops, programs] = await Promise.all([
      Opportunity.find().lean(),
      Program.find().lean()
    ]);
    
    const normalizedPrograms = programs.map(p => ({
      ...p,
      type: "training",
      tags: p.tags && Array.isArray(p.tags) ? p.tags : [p.type || "NGO Program"]
    }));

    const allOps = [...ops, ...normalizedPrograms].map(op => ({
      id: op._id.toString(),
      title: op.title || "Opportunity",
      type: op.type === "training" || op.type === "course" ? "program" : "job",
      skills: Array.isArray(op.skills) ? op.skills : [],
      tags: Array.isArray(op.tags) ? op.tags : []
    }));
    
    if (allOps.length === 0) {
      return res.status(200).json({ high_match: [], medium_match: [], skill_gap_insights: [], recommended_learning_paths: [] });
    }

    try {
      // Use AI to do semantic scoring
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use 1.5 flash for speed
      const prompt = `You are an AI career matchmaking engine.
User Profile: Role="${userRole}", Skills=[${userSkills.join(", ")}]

Available Opportunities:
${JSON.stringify(allOps)}

Your task:
1. Score each opportunity from 0 to 99 based on how well it fits the user profile and skills. Consider semantic meaning! If the user is a "welder" and the job is "web development", they are a 0% match!
2. Provide a 1-sentence reason for the score limit 50 chars.
3. Identify exactly 4 realistic "skill_gap_insights" (skills the user should learn next realistically based ONLY on their current true role). Do NOT return placeholders.
4. Suggest exactly 2 specific "recommended_learning_paths" sentences based on their role.

Return EXACTLY a JSON string with NO markdown formatting, no \`\`\`json blocks.
Format:
{
  "mapped_opportunities": [
    {
      "id": "string",
      "title": "string",
      "type": "string",
      "match_score": number, 
      "matched_skills": ["string"],
      "missing_skills": ["string"],
      "reason": "string"
    }
  ],
  "skill_gap_insights": ["string"],
  "recommended_learning_paths": ["string"]
}`;

      const aiResponse = await model.generateContent(prompt);
      let outputText = aiResponse.response.text();
      outputText = outputText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedAi = JSON.parse(outputText);

       // Filter and sort the AI results
       const mapped = parsedAi.mapped_opportunities;
       // We MUST map the ids back exactly to the original ops
       const validIds = new Set(allOps.map(o => o.id));
       const validMapped = mapped.filter(m => validIds.has(m.id));

       const high_match = validMapped.filter(m => m.match_score >= 75).sort((a,b) => b.match_score - a.match_score).slice(0, 5);
       const medium_match = validMapped.filter(m => m.match_score < 75 && m.match_score >= 40).sort((a,b) => b.match_score - a.match_score).slice(0, 5);

       return res.status(200).json({
         high_match,
         medium_match,
         skill_gap_insights: parsedAi.skill_gap_insights || ["Domain Mastery", "Professional Networking"],
         recommended_learning_paths: parsedAi.recommended_learning_paths || ["Expand your skills.", "Find relevant local programs."]
       });

    } catch (aiError) {
      console.error("AI matching failed, falling back:", aiError);
      
      // Strict Fallback logic
      const mapped = allOps.map(op => {
        const opSkills = (op.skills || []).map(s => s.toLowerCase());
        const matched = opSkills.filter(s => userSkills.includes(s));
        const missing = opSkills.filter(s => !userSkills.includes(s));
        
        let score = 0;
        const combinedString = (op.title + " " + opSkills.join(" ") + " " + op.tags.join(" ")).toLowerCase();
        
        // Very strict logic: if user role isn't matched and no skills matched, score remains 0.
        for (const usk of userSkills) {
            if (combinedString.includes(usk)) score += 30;
        }
        if (combinedString.includes(userRole.toLowerCase())) score += 40;

        score = Math.min(99, Math.floor(score + (matched.length > 0 ? (matched.length / Math.max(1, opSkills.length))*50 : 0)));

        return {
          id: op.id,
          title: op.title,
          type: op.type,
          match_score: score,
          matched_skills: matched.length > 0 ? matched : [userRole],
          missing_skills: missing.length > 0 ? missing : ["Industry Focus"],
          reason: score > 50 
            ? `Your background aligns with this ${op.type}.`
            : `This ${op.type} requires skills not in your profile.`
        };
      });

      const high_match = mapped.filter(m => m.match_score >= 75).sort((a,b) => b.match_score - a.match_score).slice(0, 5);
      const medium_match = mapped.filter(m => m.match_score < 75 && m.match_score >= 40).sort((a,b) => b.match_score - a.match_score).slice(0, 5);

      return res.status(200).json({
        high_match,
        medium_match,
        skill_gap_insights: ["Core Competency Enhancement", "Domain Specialization"],
        recommended_learning_paths: [`Review training programs for ${userRole}s.`, "Seek out entry-level opportunities in your specific field."]
      });
    }

  } catch (error) {
    console.error("RECOMMENDATION ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
