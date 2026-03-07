import { useEffect, useState } from "react";
import { Lottie, type LottieAnimationData } from "@remotion/lottie";
import {
  cancelRender,
  continueRender,
  delayRender,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface LottieHeroProps {
  src: string;
  size?: number;
  loop?: boolean;
  playbackRate?: number;
}

export const LottieHero: React.FC<LottieHeroProps> = ({
  src,
  size = 300,
  loop = true,
  playbackRate = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [handle] = useState(() => delayRender("Loading Lottie animation"));
  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);

  useEffect(() => {
    const url = src.startsWith("http") ? src : staticFile(src);
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setAnimationData(json as LottieAnimationData);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [src, handle]);

  const entrance = spring({
    fps,
    frame,
    config: { damping: 200 },
  });

  if (!animationData) {
    return null;
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        opacity: entrance,
        transform: `scale(${entrance})`,
      }}
    >
      <Lottie
        animationData={animationData}
        playbackRate={playbackRate}
        loop={loop}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
