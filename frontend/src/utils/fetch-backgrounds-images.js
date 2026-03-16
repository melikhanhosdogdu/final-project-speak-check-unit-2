export const getIconColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  return brightness < 128 ? "light" : "dark";
};

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_ACCESS_KEY;

if (!PEXELS_API_KEY) {
}

export const fetchBackgroundImages = async () => {
  if (!PEXELS_API_KEY) {
    console.error("Pexels API key is missing");
    return null;
  }

  const keywords = [
    "nature",
    "technology",
    "city",
    "ocean",
    "mountains",
    "forest",
    "space",
    "animals",
    "art",
    "travel",
  ];
  const orientation = "horizontal";

  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${randomKeyword}&per_page=1&orientation=${orientation}`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    },
  );

  const data = await response.json();

  if (data.photos && data.photos.length > 0) {
    const photo = data.photos[0];

    return photo.src.large;
  }

  return null;
};
