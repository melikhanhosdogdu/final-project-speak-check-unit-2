import bgImage1 from "../assets/post-bg-images/post-bg-image-1.jpg";
import bgImage2 from "../assets/post-bg-images/post-bg-image-2.jpg";
import bgImage3 from "../assets/post-bg-images/post-bg-image-3.jpg";
import bgImage4 from "../assets/post-bg-images/post-bg-image-4.jpg";
import bgImage5 from "../assets/post-bg-images/post-bg-image-5.jpg";
import bgImage6 from "../assets/post-bg-images/post-bg-image-6.jpg";
import bgImage7 from "../assets/post-bg-images/post-bg-image-7.jpg";
import bgImage8 from "../assets/post-bg-images/post-bg-image-8.jpg";
import bgImage9 from "../assets/post-bg-images/post-bg-image-9.jpg";
import bgImage10 from "../assets/post-bg-images/post-bg-image-10.jpg";
import bgImage11 from "../assets/post-bg-images/post-bg-image-11.jpg";
import bgImage12 from "../assets/post-bg-images/post-bg-image-12.jpg";
import bgImage13 from "../assets/post-bg-images/post-bg-image-13.jpg";
import bgImage14 from "../assets/post-bg-images/post-bg-image-14.jpg";

export const backgroundImages = [
  { image: bgImage1, theme: "dark" },
  { image: bgImage2, theme: "dark" },
  { image: bgImage3, theme: "dark" },
  { image: bgImage4, theme: "light" },
  { image: bgImage5, theme: "dark" },
  { image: bgImage6, theme: "dark" },
  { image: bgImage7, theme: "dark" },
  { image: bgImage8, theme: "dark" },
  { image: bgImage9, theme: "dark" },
  { image: bgImage10, theme: "dark" },
  { image: bgImage11, theme: "light" },
  { image: bgImage12, theme: "light" },
  { image: bgImage13, theme: "dark" },
  { image: bgImage14, theme: "dark" },
];

export const getBackgroundForId = (id) => {
  const index = id % backgroundImages.length;
  return backgroundImages[index];
};
