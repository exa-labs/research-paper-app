import ResearchPaperFinder from "../components/ResearchPaperFinder";

export default function Home() {
  return (
    <main className="flex relative min-h-screen flex-col items-center justify-center p-4">

      {/* background grid design texture code */}
      <div className="absolute inset-0 -z-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_0px),linear-gradient(to_bottom,#80808012_1px,transparent_0px)] bg-[size:50px_50px]"></div>

      <ResearchPaperFinder />
    </main>
  );
}