import { AbsoluteFill } from "remotion";

export const Intro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "#fff", fontSize: 72 }}>Intro</h1>
    </AbsoluteFill>
  );
};
