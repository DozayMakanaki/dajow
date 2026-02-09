// ✅ Single source of truth (rich category objects)
export const categories = [
  {
    slug: "african-foodstuff",
    name: "African Foodstuff",
    image: "/categories/african-food.jpg",
  },
  {
    slug: "wigs",
    name: "Wigs",
    image: "/categories/wigs.jpg",
  },
  {
    slug: "packaged-foods",
    name: "Packaged Foods",
    image: "/categories/packaged-foods.jpg",
  },
  {
    slug: "spices",
    name: "Spices",
    image: "/categories/spices.jpg",
  },
  {
    slug: "snacks",
    name: "Snacks",
    image: "/categories/snacks.jpg",
  },
  {
    slug: "beverages",
    name: "Beverages",
    image: "/categories/beverages.jpg",
  },
]

// ✅ Derived list for selects, forms, admin edits
export const PRODUCT_CATEGORIES = categories.map(
  (category) => category.name
)
