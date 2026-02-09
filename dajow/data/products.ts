export type Product = {
  id: string
  name: string
  slug: string
  price: number // base currency NGN
  category: string
  section: string
  image: string
  description: string
  inStock: boolean
}
const products: Product[] = [
  // 1) Stockfish Middle
  {
    id: "stockfish-middle",
    name: "Stockfish Middle",
    slug: "stockfish-middle",
    price: 18500,
    category: "african-foodstuff",
    section: "tubers",
    image: "/products/stockfish-middle.jpg",
    description:
      "Premium dried stockfish middle cuts, rich in protein and perfect for traditional soups.",
    inStock: true,
  },

  // 2) Stockfish Ear
  {
    id: "stockfish-ear",
    name: "Stockfish Ear",
    slug: "stockfish-ear",
    price: 22000,
    category: "african-foodstuff",
    section: "tubers",
    image: "/products/stockfish-ear.jpg",
    description:
      "High-grade stockfish ear pieces, carefully dried for authentic African cooking.",
    inStock: true,
  },

  // 3) Nido Milk
  {
    id: "nido-milk",
    name: "Nido Milk Powder",
    slug: "nido-milk",
    price: 9500,
    category: "packaged-foods",
    section: "drinks",
    image: "/products/nido-milk.jpg",
    description:
      "Nutritious powdered milk fortified with vitamins for daily family use.",
    inStock: true,
  },

  // 4) Peak Milk (powder)
  {
    id: "peak-milk",
    name: "Peak Milk Powder",
    slug: "peak-milk",
    price: 8700,
    category: "packaged-foods",
    section: "drinks",
    image: "/products/peak-milk.jpg",
    description:
      "Creamy and rich milk powder trusted by households across Africa.",
    inStock: true,
  },

  // 5) Tropical Sun Milk Powder
  {
    id: "tropical-sun-milk-powder",
    name: "Tropical Sun Milk Powder",
    slug: "tropical-sun-milk-powder",
    price: 7900,
    category: "packaged-foods",
    section: "drinks",
    image: "/products/tropical-sun-milk-powder.jpg",
    description:
      "Quality milk powder for cooking, tea, or cereal—light, smooth, and easy to mix.",
    inStock: true,
  },

  // 6) Crunchy Coconut Peanut
  {
    id: "crunchy-coconut-peanut",
    name: "Crunchy Coconut Peanut",
    slug: "crunchy-coconut-peanut",
    price: 1200,
    category: "packaged-foods",
    section: "snacks",
    image: "/products/crunchy-coconut-peanut.jpg",
    description:
      "Sweet, crunchy peanut snack with coconut flavor—great for on-the-go snacking.",
    inStock: true,
  },

  // 7) St Louis Cube Sugar
  {
    id: "st-louis-cube-sugar",
    name: "St Louis Cube Sugar",
    slug: "st-louis-cube-sugar",
    price: 1800,
    category: "packaged-foods",
    section: "ready-meals",
    image: "/products/st-louis-cube-sugar.jpg",
    description:
      "Premium cube sugar ideal for tea or coffee, neatly portioned for convenience.",
    inStock: true,
  },

  // 8) Peak Milk Liquid
  {
    id: "peak-milk-liquid",
    name: "Peak Milk Liquid",
    slug: "peak-milk-liquid",
    price: 3800,
    category: "packaged-foods",
    section: "drinks",
    image: "/products/peak-milk-liquid.jpg",
    description:
      "Ready-to-drink milk in convenient bottles, perfect for quick breakfasts or snacks.",
    inStock: true,
  },

  // 9) Milo
  {
    id: "milo",
    name: "Milo",
    slug: "milo",
    price: 7200,
    category: "packaged-foods",
    section: "drinks",
    image: "/products/milo.jpg",
    description:
      "Chocolate malt beverage providing energy and nutrition—ideal anytime drink.",
    inStock: true,
  },

  // 10) Golden Morn
  {
    id: "golden-morn",
    name: "Golden Morn",
    slug: "golden-morn",
    price: 3500,
    category: "packaged-foods",
    section: "snacks",
    image: "/products/golden-morn.jpg",
    description:
      "Nutritious maize-based cereal for quick, wholesome breakfasts.",
    inStock: true,
  },

  // 11) Ovaltine
  {
    id: "ovaltine",
    name: "Ovaltine",
    slug: "ovaltine",
    price: 6400,
    category: "packaged-foods",
    section: "drinks",
    image: "/products/ovaltine.jpg",
    description:
      "Classic malt drink mix for rich flavor, great with hot or cold milk.",
    inStock: true,
  },

  // 12) De Rica Tin Tomato
  {
    id: "de-rica-tin-tomato",
    name: "De Rica Tin Tomato",
    slug: "de-rica-tin-tomato",
    price: 800,
    category: "packaged-foods",
    section: "ready-meals",
    image: "/products/de-rica-tin-tomato.jpg",
    description:
      "Quality tin tomato for cooking stews and sauces with consistent taste.",
    inStock: true,
  },

  // 13) Sonia Tin Tomato
  {
    id: "sonia-tin-tomato",
    name: "Sonia Tin Tomato",
    slug: "sonia-tin-tomato",
    price: 750,
    category: "packaged-foods",
    section: "ready-meals",
    image: "/products/sonia-tin-tomato.jpg",
    description:
      "Affordable tin tomato option for fast, delicious meals at home.",
    inStock: true,
  },

  // 14) Clappa Tin Tomato
  {
    id: "clappa-tin-tomato",
    name: "Clappa Tin Tomato",
    slug: "clappa-tin-tomato",
    price: 780,
    category: "packaged-foods",
    section: "ready-meals",
    image: "/products/clappa-tin-tomato.jpg",
    description:
      "Bright, flavorful tin tomato brand for hearty stews and sauces.",
    inStock: true,
  },

  // 15) Ghana Fresh Palmnut Cream
  {
    id: "ghana-fresh-palmnut-cream-400g",
    name: "Ghana Fresh Palmnut Cream (400g)",
    slug: "ghana-fresh-palmnut-cream-400g",
    price: 3200,
    category: "african-foodstuff",
    section: "oil",
    image: "/products/ghana-fresh-palmnut-cream-400g.jpg",
    description:
      "Rich palmnut cream perfect for soups and stews; authentic Ghanaian flavor.",
    inStock: true,
  },

  // 16) Ghana Fresh Palmnut Cream (800g)
  {
    id: "ghana-fresh-palmnut-cream-800g",
    name: "Ghana Fresh Palmnut Cream (800g)",
    slug: "ghana-fresh-palmnut-cream-800g",
    price: 6000,
    category: "african-foodstuff",
    section: "oil",
    image: "/products/ghana-fresh-palmnut-cream-800g.jpg",
    description:
      "Larger pack of rich palmnut cream for bigger meals or family cooking.",
    inStock: true,
  },

  // 17) Ghana Best Palm Nut Soup (400g)
  {
    id: "ghana-best-palm-nut-soup-400g",
    name: "Ghana Best Palm Nut Soup (400g)",
    slug: "ghana-best-palm-nut-soup-400g",
    price: 2800,
    category: "african-foodstuff",
    section: "oil",
    image: "/products/ghana-best-palm-nut-soup-400g.jpg",
    description:
      "Ready-to-use palm nut soup base, quick and tasty way to make traditional dishes.",
    inStock: true,
  },

  // 18) Ghana Best Palm Nut Soup (800g)
  {
    id: "ghana-best-palm-nut-soup-800g",
    name: "Ghana Best Palm Nut Soup (800g)",
    slug: "ghana-best-palm-nut-soup-800g",
    price: 5200,
    category: "african-foodstuff",
    section: "oil",
    image: "/products/ghana-best-palm-nut-soup-800g.jpg",
    description:
      "Family-size palm nut soup base for richer meals and larger servings.",
    inStock: true,
  },

  // 19) Crosse & Blackwell Mayonnaise
  {
    id: "crosse-blackwell-mayonnaise",
    name: "Crosse & Blackwell Original Mayonnaise",
    slug: "crosse-blackwell-mayonnaise",
    price: 4500,
    category: "packaged-foods",
    section: "snacks",
    image: "/products/crosse-blackwell-mayonnaise.jpg",
    description:
      "Premium mayonnaise brand for sandwiches, salads, and snacks.",
    inStock: true,
  },

  // 20) ASLI Golden Basmati Rice 5kg
  {
    id: "asli-golden-basmati-5kg",
    name: "ASLI Golden Basmati Rice 5kg",
    slug: "asli-golden-basmati-5kg",
    price: 28500,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/asli-golden-basmati-5kg.jpg",
    description:
      "Premium long-grain basmati rice with rich aroma and fluffy texture.",
    inStock: true,
  },

  // 21) ASLI Golden Basmati Rice 10kg
  {
    id: "asli-golden-basmati-10kg",
    name: "ASLI Golden Basmati Rice 10kg",
    slug: "asli-golden-basmati-10kg",
    price: 54000,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/asli-golden-basmati-10kg.jpg",
    description:
      "Larger pack of premium basmati rice for families and bulk cooking.",
    inStock: true,
  },

  // 22) Tropical Sun Golden Sella Basmati Rice 5kg
  {
    id: "tropical-sun-golden-sella-5kg",
    name: "Tropical Sun Golden Sella Basmati Rice 5kg",
    slug: "tropical-sun-golden-sella-5kg",
    price: 29500,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/tropical-sun-golden-sella-5kg.jpg",
    description:
      "Parboiled golden sella basmati rice that cooks perfectly every time.",
    inStock: true,
  },

  // 23) Tropical Sun Golden Sella Basmati Rice 10kg
  {
    id: "tropical-sun-golden-sella-10kg",
    name: "Tropical Sun Golden Sella Basmati Rice 10kg",
    slug: "tropical-sun-golden-sella-10kg",
    price: 57000,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/tropical-sun-golden-sella-10kg.jpg",
    description:
      "Bulk pack of parboiled golden sella basmati rice for larger households.",
    inStock: true,
  },

  // 24) Avtar 1121 Basmati Rice 5kg
  {
    id: "avtar-1121-basmati-5kg",
    name: "Avtar 1121 Basmati Rice 5kg",
    slug: "avtar-1121-basmati-5kg",
    price: 33000,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/avtar-1121-basmati-5kg.jpg",
    description:
      "High-quality 1121 basmati rice known for slender grains and aromatic flavor.",
    inStock: true,
  },

  // 25) Peacock Easy Cook Long Grain Rice 10kg
  {
    id: "peacock-easy-cook-10kg",
    name: "Peacock Easy Cook Long Grain Rice 10kg",
    slug: "peacock-easy-cook-10kg",
    price: 42000,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/peacock-easy-cook-10kg.jpg",
    description:
      "Economical long-grain rice with easy cooking for everyday meals.",
    inStock: true,
  },

  // 26) Peacock Easy Cook Long Grain Rice 20kg
  {
    id: "peacock-easy-cook-20kg",
    name: "Peacock Easy Cook Long Grain Rice 20kg",
    slug: "peacock-easy-cook-20kg",
    price: 80000,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/peacock-easy-cook-20kg.jpg",
    description:
      "Large bulk pack for businesses or large families who cook often.",
    inStock: true,
  },

  // 27) President Golden Sella Basmati Rice 10kg
  {
    id: "president-golden-sella-10kg",
    name: "President Golden Sella Basmati Rice 10kg",
    slug: "president-golden-sella-10kg",
    price: 58000,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/president-golden-sella-10kg.jpg",
    description:
      "Premium bulk basmati rice with parboiled golden grains for excellent texture.",
    inStock: true,
  },

  // 28) Pavizhan Parboiled Rice 5kg
  {
    id: "pavizhan-parboiled-5kg",
    name: "Pavizhan Parboiled Rice 5kg",
    slug: "pavizhan-parboiled-5kg",
    price: 30000,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/pavizhan-parboiled-5kg.jpg",
    description:
      "Parboiled rice with reliable quality, easy to cook for day-to-day meals.",
    inStock: true,
  },

  // 29) Jasmine Rice Eagle Brand 5kg
  {
    id: "jasmine-eagle-brand-5kg",
    name: "Jasmine Rice Eagle Brand 5kg",
    slug: "jasmine-eagle-brand-5kg",
    price: 28000,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/jasmine-eagle-brand-5kg.jpg",
    description:
      "Fragrant jasmine rice from Eagle Brand, ideal for aromatic meals.",
    inStock: true,
  },

  // 30) Thai Jasmine Rice 5kg
  {
    id: "thai-jasmine-rice-5kg",
    name: "Thai Jasmine Rice 5kg",
    slug: "thai-jasmine-rice-5kg",
    price: 26500,
    category: "african-foodstuff",
    section: "rice-grains",
    image: "/products/thai-jasmine-rice-5kg.jpg",
    description:
      "Fragrant Thai jasmine rice with soft texture and natural aroma.",
    inStock: true,
  },

  // 31) Topop Red Kidney Beans 400g
  {
    id: "topop-red-kidney-beans-400g",
    name: "Topop Red Kidney Beans 400g",
    slug: "topop-red-kidney-beans-400g",
    price: 1200,
    category: "packaged-foods",
    section: "ready-meals",
    image: "/products/topop-red-kidney-beans.jpg",
    description:
      "Shelf-stable beans for quick stews and protein-rich meals.",
    inStock: true,
  },

  // 32) Areeq Sunflower Oil 1L
  {
    id: "areeq-sunflower-oil-1l",
    name: "Areeq Sunflower Oil 1L",
    slug: "areeq-sunflower-oil-1l",
    price: 3900,
    category: "african-foodstuff",
    section: "oil",
    image: "/products/areeq-sunflower-oil-1l.jpg",
    description:
      "Light, high-quality sunflower oil suitable for frying and general cooking.",
    inStock: true,
  },

  // 33) Tropical Sun Sunflower Oil 5L
  {
    id: "tropical-sun-sunflower-oil-5l",
    name: "Tropical Sun Sunflower Oil 5L",
    slug: "tropical-sun-sunflower-oil-5l",
    price: 19500,
    category: "african-foodstuff",
    section: "oil",
    image: "/products/tropical-sun-sunflower-oil-5l.jpg",
    description:
      "Bulk sunflower oil for households or small businesses, clean and versatile.",
    inStock: true,
  },

  // 34) Oluolu Palm Oil 2.5L
  {
    id: "oluolu-palm-oil-2-5l",
    name: "Oluolu Palm Oil 2.5L",
    slug: "oluolu-palm-oil-2-5l",
    price: 9200,
    category: "african-foodstuff",
    section: "oil",
    image: "/products/oluolu-palm-oil-2.5l.jpg",
    description:
      "Pure red palm oil in a mid-size pack for daily cooking needs.",
    inStock: true,
  },

  // 35) African Beauty Pure Red Oil 2.5L
  {
    id: "african-beauty-red-oil-2-5l",
    name: "African Beauty Pure Red Oil 2.5L",
    slug: "african-beauty-red-oil-2-5l",
    price: 9000,
    category: "african-foodstuff",
    section: "oil",
    image: "/products/african-beauty-red-oil-2.5l.jpg",
    description:
      "Trusted red palm oil brand in a convenient 2.5L pack for family kitchens.",
    inStock: true,
  },

  // 36) Yale Cabin Biscuit
  {
    id: "yale-cabin-biscuit",
    name: "Yale Cabin Biscuit",
    slug: "yale-cabin-biscuit",
    price: 1800,
    category: "packaged-foods",
    section: "snacks",
    image: "/products/yale-cabin-biscuit.jpg",
    description:
      "Classic cabin biscuit loved by both kids and adults, ideal for tea time.",
    inStock: true,
  },

  // 37) Oxford Cabin Biscuit
  {
    id: "oxford-cabin-biscuit",
    name: "Oxford Cabin Biscuit",
    slug: "oxford-cabin-biscuit",
    price: 1800,
    category: "packaged-foods",
    section: "snacks",
    image: "/products/oxford-cabin-biscuit.jpg",
    description:
      "Crunchy biscuit with balanced sweetness, perfect snack for any time of day.",
    inStock: true,
  },

  // 38) Ghana Yellow Garri — sample pack
  {
    id: "ghana-yellow-garri-5kg",
    name: "Ghana Yellow Garri 5kg",
    slug: "ghana-yellow-garri-5kg",
    price: 7800,
    category: "african-foodstuff",
    section: "tubers",
    image: "/products/ghana-yellow-garri-5kg.jpg",
    description:
      "Crunchy, well-processed yellow garri, great for eba or soaking.",
    inStock: true,
  },

  // 39) Ghana White Garri — sample pack
  {
    id: "ghana-white-garri-5kg",
    name: "Ghana White Garri 5kg",
    slug: "ghana-white-garri-5kg",
    price: 8000,
    category: "african-foodstuff",
    section: "tubers",
    image: "/products/ghana-white-garri-5kg.jpg",
    description:
      "Clean white garri with smooth texture; ideal for traditional meals.",
    inStock: true,
  },

  // 40) Ijebu Garri White — sample pack
  {
    id: "ijebu-garri-white-5kg",
    name: "Ijebu Garri White 5kg",
    slug: "ijebu-garri-white-5kg",
    price: 8200,
    category: "african-foodstuff",
    section: "tubers",
    image: "/products/ijebu-garri-white-5kg.jpg",
    description:
      "Extra crispy Ijebu-style garri with sharper taste and premium texture.",
    inStock: true,
  },
{
  id: "african-beauty-pure-red-oil-2-5l",
  name: "African Beauty Pure Red Oil 2.5L",
  slug: "african-beauty-pure-red-oil-2-5l",
  price: 8200,
  category: "african-foodstuff",
  section: "oil",
  image: "/products/african-beauty-pure-red-oil-2-5l.jpg",
  description:
    "Premium-grade pure red palm oil with authentic African flavor.",
  inStock: true,
},
{
  id: "oluolu-poundo-iyan-4kg",
  name: "Oluolu Poundo Iyan 4kg",
  slug: "oluolu-poundo-iyan-4kg",
  price: 10800,
  category: "african-foodstuff",
  section: "tubers",
  image: "/products/oluolu-poundo-iyan-4kg.jpg",
  description:
    "Instant pounded yam flour with soft texture and authentic taste.",
  inStock: true,
},
 {
  id: "super-mabela-5kg",
  name: "Super Mabela 5kg",
  slug: "super-mabela-5kg",
  price: 7200,
  category: "african-foodstuff",
  section: "tubers",
  image: "/products/super-mabela-5kg.jpg",
  description:
    "Nutritious maize meal ideal for pap, porridge, and traditional meals.",
  inStock: true,
},
{
  id: "iwisa-maize-meal-5kg",
  name: "Iwisa Maize Meal 5kg",
  slug: "iwisa-maize-meal-5kg",
  price: 7800,
  category: "african-foodstuff",
  section: "tubers",
  image: "/products/iwisa-maize-meal-5kg.jpg",
  description:
    "Premium South African maize meal with smooth consistency.",
  inStock: true,
},
{
  id: "iwisa-instant-maize-porridge-1kg",
  name: "Iwisa Instant Maize Porridge 1kg",
  slug: "iwisa-instant-maize-porridge-1kg",
  price: 2800,
  category: "packaged-foods",
  section: "ready-meals",
  image: "/products/iwisa-instant-maize-porridge-1kg.jpg",
  description:
    "Quick-cooking instant maize porridge, original and vanilla flavor.",
  inStock: true,
},
{
  id: "grandios-pap-500g",
  name: "Grandios Pap 500g",
  slug: "grandios-pap-500g",
  price: 2200,
  category: "packaged-foods",
  section: "ready-meals",
  image: "/products/grandios-pap-500g.jpg",
  description:
    "Smooth pap flour available in white and yellow variants.",
  inStock: true,
},
{
  id: "tropical-sun-yam-flour-1-5kg",
  name: "Tropical Sun Yam Flour 1.5kg",
  slug: "tropical-sun-yam-flour-1-5kg",
  price: 6800,
  category: "african-foodstuff",
  section: "tubers",
  image: "/products/tropical-sun-yam-flour-1-5kg.jpg",
  description:
    "High-quality yam flour for soft and stretchy amala.",
  inStock: true,
},
{
  id: "tropical-sun-peeled-beans-1-5kg",
  name: "Tropical Sun Peeled Beans 1.5kg",
  slug: "tropical-sun-peeled-beans-1-5kg",
  price: 5200,
  category: "african-foodstuff",
  section: "rice-grains",
  image: "/products/tropical-sun-peeled-beans-1-5kg.jpg",
  description:
    "Clean, skinless beans ideal for moi-moi and akara.",
  inStock: true,
},
{
  id: "tropical-sun-beans-flour-500g",
  name: "Tropical Sun Beans Flour 500g",
  slug: "tropical-sun-beans-flour-500g",
  price: 2600,
  category: "african-foodstuff",
  section: "rice-grains",
  image: "/products/tropical-sun-beans-flour-500g.jpg",
  description:
    "Finely milled beans flour for fast meal preparation.",
  inStock: true,
},
{
  id: "khadi-sweet-beans-4kg",
  name: "Khadi Sweet Beans 4kg",
  slug: "khadi-sweet-beans-4kg",
  price: 6400,
  category: "african-foodstuff",
  section: "rice-grains",
  image: "/products/khadi-sweet-beans-4kg.jpg",
  description:
    "Naturally sweet beans with fast cooking time.",
  inStock: true,
},
{
  id: "african-beauty-black-eye-beans-4kg",
  name: "African Beauty Black Eye Beans 4kg",
  slug: "african-beauty-black-eye-beans-4kg",
  price: 7000,
  category: "african-foodstuff",
  section: "rice-grains",
  image: "/products/african-beauty-black-eye-beans-4kg.jpg",
  description:
    "Premium black-eyed beans with rich flavor and texture.",
  inStock: true,
},
{
  id: "african-beauty-plantain-fufu-680g",
  name: "African Beauty Yellow Plantain Fufu 680g",
  slug: "african-beauty-plantain-fufu-680g",
  price: 3200,
  category: "african-foodstuff",
  section: "tubers",
  image: "/products/african-beauty-plantain-fufu-680g.jpg",
  description:
    "Healthy plantain fufu flour with authentic taste.",
  inStock: true,
},
{
  id: "africas-finest-plantain-fufu-680g",
  name: "Africa’s Finest Plantain Fufu 680g",
  slug: "africas-finest-plantain-fufu-680g",
  price: 3300,
  category: "african-foodstuff",
  section: "tubers",
  image: "/products/africas-finest-plantain-fufu-680g.jpg",
  description:
    "Smooth plantain-based swallow with great elasticity.",
  inStock: true,
},
{
  id: "african-beauty-cocoyam-fufu-680g",
  name: "African Beauty Cocoyam Fufu 680g",
  slug: "african-beauty-cocoyam-fufu-680g",
  price: 3400,
  category: "african-foodstuff",
  section: "tubers",
  image: "/products/african-beauty-cocoyam-fufu-680g.jpg",
  description:
    "Nutritious cocoyam fufu with soft and smooth texture.",
  inStock: true,
},
{
  id: "lady-b-custard-powder-500g",
  name: "Lady B Custard Powder 500g",
  slug: "lady-b-custard-powder-500g",
  price: 2400,
  category: "packaged-foods",
  section: "ready-meals",
  image: "/products/lady-b-custard-powder-500g.jpg",
  description:
    "Rich and creamy custard powder for breakfast and desserts.",
  inStock: true,
},
{
  id: "dry-locust-beans-250g",
  name: "Dry Locust Beans (Iru) 250g",
  slug: "dry-locust-beans-250g",
  price: 3000,
  category: "african-foodstuff",
  section: "spices",
  image: "/products/dry-locust-beans-250g.jpg",
  description:
    "Traditional fermented locust beans for rich soup flavor.",
  inStock: true,
},
{
  id: "suya-pepper-85g",
  name: "Suya Pepper 85g",
  slug: "suya-pepper-85g",
  price: 1800,
  category: "african-foodstuff",
  section: "spices",
  image: "/products/suya-pepper-85g.jpg",
  description:
    "Spicy suya seasoning blend with authentic northern taste.",
  inStock: true,
},
{
  id: "whole-ogbono-285g",
  name: "Whole Ogbono 285g",
  slug: "whole-ogbono-285g",
  price: 4200,
  category: "african-foodstuff",
  section: "spices",
  image: "/products/whole-ogbono-285g.jpg",
  description:
    "Whole wild mango seeds for thick and flavorful soups.",
  inStock: true,
},
{
  id: "tura-soap-3x120g",
  name: "Tura Soap 3x120g",
  slug: "tura-soap-3x120g",
  price: 2600,
  category: "soap & personal-care",
  section: "soap & personal-care",
  image: "/products/tura-soap-3x120g.jpg",
  description:
    "Popular bathing soap with refreshing fragrance.",
  inStock: true,
},
{
  id: "dudu-osun-6x150g",
  name: "Dudu Osun Black Soap 6x150g",
  slug: "dudu-osun-6x150g",
  price: 7800,
  category: "soap & personal-care",
  section: "soap & personal-care",
  image: "/products/dudu-osun-6x150g.jpg",
  description:
    "Natural African black soap for healthy skin care.",
  inStock: true,
},
{
  id: "lipton-yellow-label-tea-25",
  name: "Lipton Yellow Label Tea 25 Bags",
  slug: "lipton-yellow-label-tea-25",
  price: 2800,
  category: "packaged-foods",
  section: "drinks",
  image: "/products/lipton-yellow-label-tea-25.jpg",
  description:
    "Classic black tea with rich aroma and smooth taste.",
  inStock: true,
},
{
  id: "tomtom-menthol-candy-152g",
  name: "TomTom Menthol Candy 152g",
  slug: "tomtom-menthol-candy-152g",
  price: 1900,
  category: "packaged-foods",
  section: "snacks",
  image: "/products/tomtom-menthol-candy-152g.jpg",
  description:
    "Strong menthol candy for soothing throat freshness.",
  inStock: true,
}, 
{
  id: "snout-beef-white-1kg",
  name: "Snout Beef White 1kg",
  slug: "snout-beef-white-1kg",
  price: 8500,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/snout-beef-white-1kg.jpg",
  description:
    "Clean white snout beef suitable for soups and traditional dishes.",
  inStock: true,
},
{
  id: "assorted-beef-offal-1kg",
  name: "Assorted Beef / Offal 1kg",
  slug: "assorted-beef-offal-1kg",
  price: 7800,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/assorted-beef-offal-1kg.jpg",
  description:
    "Fresh assorted beef offal mix ideal for rich African soups.",
  inStock: true,
},
{
  id: "beef-tripe-boneless",
  name: "Beef Tripe Boneless",
  slug: "beef-tripe-boneless",
  price: 7200,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/beef-tripe-boneless.jpg",
  description:
    "Boneless beef tripe cleaned and ready for cooking.",
  inStock: true,
},
{
  id: "cowleg-hocks",
  name: "Cow Leg Hocks",
  slug: "cowleg-hocks",
  price: 9000,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/cowleg-hocks.jpg",
  description:
    "Meaty cow leg hocks perfect for pepper soup and stews.",
  inStock: true,
},
{
  id: "shaki-honeycomb-tripe",
  name: "Shaki (Honeycomb Tripe)",
  slug: "shaki-honeycomb-tripe",
  price: 8200,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/shaki-honeycomb-tripe.jpg",
  description:
    "Premium honeycomb tripe with rich texture and flavor.",
  inStock: true,
},
{
  id: "ponmo-white",
  name: "Ponmo White",
  slug: "ponmo-white",
  price: 6500,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/ponmo-white.jpg",
  description:
    "Soft white ponmo, well processed and ready for soups.",
  inStock: true,
},
{
  id: "traditional-goat-meat-halal-1kg",
  name: "Traditional Goat Meat Halal 1kg",
  slug: "traditional-goat-meat-halal-1kg",
  price: 12500,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/traditional-goat-meat-halal-1kg.jpg",
  description:
    "Fresh halal goat meat cut for traditional African cooking.",
  inStock: true,
},
{
  id: "smoked-goat-meat-with-skin",
  name: "Smoked Goat Meat with Skin",
  slug: "smoked-goat-meat-with-skin",
  price: 13800,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/smoked-goat-meat-with-skin.jpg",
  description:
    "Naturally smoked goat meat with deep traditional flavor.",
  inStock: true,
},
{
  id: "frozen-turkey-drumstick-2kg",
  name: "Frozen Turkey Drumstick 2kg",
  slug: "frozen-turkey-drumstick-2kg",
  price: 15500,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/frozen-turkey-drumstick-2kg.jpg",
  description:
    "Large frozen turkey drumsticks, juicy and protein-rich.",
  inStock: true,
},
{
  id: "turkey-gizzard-2-5kg",
  name: "Turkey Gizzard 2.5kg",
  slug: "turkey-gizzard-2-5kg",
  price: 11000,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/turkey-gizzard-2-5kg.jpg",
  description:
    "Cleaned turkey gizzards ideal for stews and grilling.",
  inStock: true,
},
{
  id: "croaker-fish-3kg-pack",
  name: "Croaker Fish 3kg Pack",
  slug: "croaker-fish-3kg-pack",
  price: 16500,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/croaker-fish-3kg-pack.jpg",
  description:
    "Whole croaker fish pack, fresh frozen and well sized.",
  inStock: true,
},
{
  id: "hake-fish-steak-1kg",
  name: "Hake Fish Steak 1kg",
  slug: "hake-fish-steak-1kg",
  price: 9800,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/hake-fish-steak-1kg.jpg",
  description:
    "Boneless hake fish steaks, perfect for frying or grilling.",
  inStock: true,
},
{
  id: "tilapia-fish-2-5kg-pack",
  name: "Tilapia Fish 2.5kg Pack",
  slug: "tilapia-fish-2-5kg-pack",
  price: 14500,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/tilapia-fish-2-5kg-pack.jpg",
  description:
    "Whole tilapia fish, frozen fresh for quality meals.",
  inStock: true,
},
{
  id: "whole-mackerel-pack-4",
  name: "Whole Mackerel (Titus) Pack of 4",
  slug: "whole-mackerel-pack-4",
  price: 13200,
  category: "african-foodstuff",
  section: "meats & fish",
  image: "/products/whole-mackerel-pack-4.jpg",
  description:
    "Frozen whole mackerel fish packed for family meals.",
  inStock: true,
},
{
  id: "dallas-hair-treatment-conditioner-medium",
  name: "Dallas Hair Treatment Conditioner Medium",
  slug: "dallas-hair-treatment-conditioner-medium",
  price: 3100,
  category: "wigs",
  section: "synthetic",
  image: "/products/dallas-hair-treatment-conditioner-medium.jpg",
  description: "Moisturizing hair conditioner for medium hair types.",
  inStock: true,
},
{
  id: "soulmate-hair-cream-big",
  name: "Soulmate Hair Cream Big",
  slug: "soulmate-hair-cream-big",
  price: 5200,
  category: "wigs",
  section: "synthetic",
  image: "/products/soulmate-hair-cream-big.jpg",
  description: "Rich hair cream for styling, smoothing, and shine.",
  inStock: true,
},
{
  id: "petals-styling-gel-medium",
  name: "Petals Styling Gel Medium",
  slug: "petals-styling-gel-medium",
  price: 2200,
  category: "wigs",
  section: "synthetic",
  image: "/products/petals-styling-gel-medium.jpg",
  description: "Strong hold styling gel for twists and braids.",
  inStock: true,
},
{
  id: "darling-superstar-82-attachment-colour-1",
  name: "Darling Superstar 82” Attachment Colour 1",
  slug: "darling-superstar-82-attachment-colour-1",
  price: 6200,
  category: "wigs",
  section: "synthetic",
  image: "/products/darling-superstar-82-attachment-colour-1.jpg",
  description: "Long braid attachment in classic black (colour 1).",
  inStock: true,
},
{
  id: "darling-superstar-64-easy-braid-black",
  name: "Darling Superstar 64” Easy Braid Black",
  slug: "darling-superstar-64-easy-braid-black",
  price: 4800,
  category: "wigs",
  section: "synthetic",
  image: "/products/darling-superstar-64-easy-braid-black.jpg",
  description: "Easy-braid synthetic hair for quick and stylish braids.",
  inStock: true,
},
{
  id: "lush-supreme-braids-10x-65",
  name: "Lush Supreme Braids 10X 65”",
  slug: "lush-supreme-braids-10x-65",
  price: 7800,
  category: "wigs",
  section: "synthetic",
  image: "/products/lush-supreme-braids-10x-65.jpg",
  description: "Complete set of 10 braid bundles for full hairstyle.",
  inStock: true,
},
{
  id: "lush-roni-curls-16-black",
  name: "Lush Roni Curls 16” Black",
  slug: "lush-roni-curls-16-black",
  price: 5200,
  category: "wigs",
  section: "curly",
  image: "/products/lush-roni-curls-16-black.jpg",
  description: "Short curly style for a chic look and easy maintenance.",
  inStock: true,
},
{
  id: "xpression-crotchet-braid-colour-1",
  name: "Xpression Crochet Braid Colour 1",
  slug: "xpression-crotchet-braid-colour-1",
  price: 4700,
  category: "wigs",
  section: "synthetic",
  image: "/products/xpression-crotchet-braid-colour-1.jpg",
  description: "Durable crochet braid hair in classic black.",
  inStock: true,
},
{
  id: "aviv-bokku-braid-60-7x-colour-1",
  name: "Aviv Bokku Braid 60” 7X Colour 1",
  slug: "aviv-bokku-braid-60-7x-colour-1",
  price: 5600,
  category: "wigs",
  section: "synthetic",
  image: "/products/aviv-bokku-braid-60-7x-colour-1.jpg",
  description: "Long braid bundles for premium hairstyles.",
  inStock: true,
},
{
  id: "rosemary-kinky-bulk-twist-colour-1",
  name: "Rosemary Kinky Bulk Twist Colour 1",
  slug: "rosemary-kinky-bulk-twist-colour-1",
  price: 5700,
  category: "wigs",
  section: "curly",
  image: "/products/rosemary-kinky-bulk-twist-colour-1.jpg",
  description: "Bulk kinky twist hair for fuller, natural-looking styles.",
  inStock: true,
},
{
  id: "modern-queen-gypsy-locs-colour-t1b-350",
  name: "Modern Queen Gypsy Locs (T1B/350)",
  slug: "modern-queen-gypsy-locs-t1b-350",
  price: 6800,
  category: "wigs",
  section: "synthetic",
  image: "/products/modern-queen-gypsy-locs-t1b-350.jpg",
  description: "Stylish locs hair in trendy shades (T1B/350 variant).",
  inStock: true,
},
{
  id: "azonto-crotchet-twist-20-colour-27",
  name: "Azonto Crochet Twist 20” Colour 27",
  slug: "azonto-crotchet-twist-20-colour-27",
  price: 5300,
  category: "wigs",
  section: "curly",
  image: "/products/azonto-crotchet-twist-20-colour-27.jpg",
  description: "Vibrant crochet twist hair for bold styles.",
  inStock: true,
},
{
  id: "freedom-braid-collection-colour-1",
  name: "Freedom Braid Collection Crochet Hair Colour 1",
  slug: "freedom-braid-collection-colour-1",
  price: 4900,
  category: "wigs",
  section: "synthetic",
  image: "/products/freedom-braid-collection-colour-1.jpg",
  description: "High-quality crochet hair for fashionable braid looks.",
  inStock: true,
},
{
  id: "nana-beauty-locs-crochet-colour-27",
  name: "Nana Beauty Locs Crochet Colour 27",
  slug: "nana-beauty-locs-crochet-colour-27",
  price: 5600,
  category: "wigs",
  section: "synthetic",
  image: "/products/nana-beauty-locs-crochet-colour-27.jpg",
  description: "Premium locs crochet hair in vibrant shade 27.",
  inStock: true,
},
{
  id: "smp-hair-extensions-crochet-21-colour-30",
  name: "SMP Hair Extensions Crochet Braids 21” Colour 30",
  slug: "smp-hair-extensions-crochet-21-colour-30",
  price: 6100,
  category: "wigs",
  section: "synthetic",
  image: "/products/smp-hair-extensions-crochet-21-colour-30.jpg",
  description: "Long crochet braids with soft, natural finish.",
  inStock: true,
},
{
  id: "dajow-handmade-crochet-curly-tip-colour-1-27",
  name: "Dajow Handmade Crochet Hair Curly Tip (Colour 1/27)",
  slug: "dajow-handmade-crochet-curly-tip-colour-1-27",
  price: 8500,
  category: "wigs",
  section: "curly",
  image: "/products/dajow-handmade-crochet-curly-tip-colour-1-27.jpg",
  description: "Handcrafted crochet hair with curly tip, two-tone style.",
  inStock: true,
},
{
  id: "dajow-watermelon-crochet-hair-colour-27",
  name: "Dajow Watermelon Crochet Hair Colour 27",
  slug: "dajow-watermelon-crochet-hair-colour-27",
  price: 7800,
  category: "wigs",
  section: "curly",
  image: "/products/dajow-watermelon-crochet-hair-colour-27.jpg",
  description: "Bright, eye-catching crochet hair in watermelon shade.",
  inStock: true,
},
{
  id: "dajow-kids-detachable-pony-braids",
  name: "Dajow Kids Detachable Pony Braids",
  slug: "dajow-kids-detachable-pony-braids",
  price: 4200,
  category: "wigs",
  section: "synthetic",
  image: "/products/dajow-kids-detachable-pony-braids.jpg",
  description: "Easy-to-wear detachable ponytail braids for kids.",
  inStock: true,
},
{
  id: "dajow-berets-handcrafted-colour-royal-blue",
  name: "Dajow Beret with Handcrafted Designs (Royal Blue)",
  slug: "dajow-berets-handcrafted-colour-royal-blue",
  price: 6000,
  category: "wigs",
  section: "synthetic",
  image: "/products/dajow-berets-handcrafted-colour-royal-blue.jpg",
  description: "Premium beret with handmade artistic design.",
  inStock: true,
},
]

export default products
