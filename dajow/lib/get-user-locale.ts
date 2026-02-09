export const getUserLocale = () => {
  if (typeof window === "undefined") return "NG"

  return navigator.language || "en-NG"
}
