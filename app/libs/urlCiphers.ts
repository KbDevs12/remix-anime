export const encodeUrl = (url: string) => {
  const shifted = url
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      const shiftedCode = code + 5;
      return String.fromCharCode(shiftedCode);
    })
    .join("");

  return btoa(shifted)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const decodeUrl = (encoded: string): string => {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

    const padding = base64.length % 4;
    const paddedBase64 = padding ? base64 + "=".repeat(4 - padding) : base64;

    const shifted = atob(paddedBase64);

    return shifted
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);

        const unshiftedCode = code - 5;
        return String.fromCharCode(unshiftedCode);
      })
      .join("");
  } catch (error) {
    console.error("Error decoding URL:", error);
    return "";
  }
};
