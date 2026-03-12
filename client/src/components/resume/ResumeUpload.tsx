"use client";

import { useState } from "react";
import { uploadResume } from "@/api/resume";

export default function ResumeUpload() {

  const [data, setData] = useState<any>(null);

  const handleUpload = async (e: any) => {

    const file = e.target.files[0];

    const result = await uploadResume(file);

    setData(result);
  };

  return (
    <div>

      <input type="file" onChange={handleUpload} />

      {data && (
        <div>

          <h2>Resume Score: {data.score}/100</h2>

          <h3>Detected Skills</h3>
          <ul>
            {data.skills.map((s: string) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <h3>Missing Skills</h3>
          <ul>
            {data.gap.missingSkills.map((s: string) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

        </div>
      )}

    </div>
  );
}