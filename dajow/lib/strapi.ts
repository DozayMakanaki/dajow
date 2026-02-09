const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337"

export async function getProducts() {
  const res = await fetch(
    `${STRAPI_URL}/api/products?populate=image`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    console.error("Strapi fetch failed:", res.status)
    return []
  }

  const json = await res.json()

  console.log("RAW STRAPI RESPONSE:", json)

  return (json.data || [])
    .filter((item: any) => item?.attributes?.slug) // 🚑 prevents crash
    .map((item: any) => ({
      id: item.id,
      slug: item.attributes.slug,
      name: item.attributes.name,
      price: item.attributes.price,
      category: item.attributes.category,
      section: item.attributes.section,

      image: item.attributes.image?.data
        ? STRAPI_URL + item.attributes.image.data.attributes.url
        : "/placeholder.png",
    }))
}
