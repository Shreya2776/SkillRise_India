export const detectSkillGap = (
  resumeSkills: string[],
  requiredSkills: string[]
) => {

  const missing = requiredSkills.filter(
    skill => !resumeSkills.includes(skill)
  );

  return {
    resumeSkills,
    missingSkills: missing,
    matchPercentage:
      ((requiredSkills.length - missing.length) / requiredSkills.length) * 100
  };
};