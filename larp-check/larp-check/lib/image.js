// Shrinks a photo in the browser before upload: max 1024px on the long side, JPEG.
// Keeps uploads small and AI image costs low. Returns a data URL.
export async function shrink(file, max = 1024) {
  if (!file || !file.type.startsWith("image/")) throw new Error("That file is not an image.");
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k);
  c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.82);
}
