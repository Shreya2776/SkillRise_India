"use client";

import { PieChart, Pie, Cell } from "recharts";

export default function SkillChart({ score }: { score: number }) {

  const data = [
    { name: "Match", value: score },
    { name: "Gap", value: 100 - score }
  ];

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="value"
        outerRadius={120}
      />
    </PieChart>
  );
}