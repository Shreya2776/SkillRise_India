import Timeline from "./Timeline";

export default function RoadmapContainer({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
        <p className="text-white/40 font-medium tracking-wide uppercase text-xs">Awaiting strategic objective...</p>
      </div>
    );
  }

  return <Timeline roadmap={data} />;
}
