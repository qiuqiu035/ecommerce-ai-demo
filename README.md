# Mini E-commerce Catalog with AI Search

A small React e-commerce demo that shows a **static product catalog (12 items)** and an **AI-powered natural language search** feature.

---

## How to Run

```bash
# Node 16+ recommended
npm install
npm start
# then open http://localhost:3000 in your browser
````

**Production Build:**

```bash
npm run build
```

---

## Features

* **Static Catalog**

  * Stored in `src/data/fakestore-sample.js`
  * 12 products with:

    * title
    * price
    * category
    * description
    * rating
    * image (local `/public/images/`)

* **Basic Filters**

  * Category buttons
  * Max price slider
  * Keyword search (title/description)

* **AI Search**

  * Natural language query parsing
    Examples:

    * `men's clothing under $50 with good reviews`
    * `electronics between 30 and 120`
  * Extracts:

    * category
    * minPrice / maxPrice
    * “good reviews” preference
  * Ranks products by intent match + token overlap + rating bias

* **Product Detail Page**

  * Loads product data from local dataset
  * Displays category, rating, price, description
  * **Similar Products** section with marquee scrolling

* **Cart Integration**

  * Uses Redux store to add products to cart

---

## Tools / Libraries Used

* [React](https://react.dev/) + [React Router](https://reactrouter.com/)
* [Redux](https://redux.js.org/) (cart logic reused from base template)
* [react-fast-marquee](https://www.npmjs.com/package/react-fast-marquee) (scrolling similar products)
* [react-loading-skeleton](https://www.npmjs.com/package/react-loading-skeleton) (loading placeholders)
* [Bootstrap](https://getbootstrap.com/) styling (from base template)
* **Custom NLP parser & ranking** (`src/utils/nlp.js`) — fully local, no external API

---

## 📂 Folder Structure (Relevant Parts Only)

src/
  components/
    Products.jsx         # Catalog + filters + AI search
    Product.jsx          # Product detail + similar products
  data/
    fakestore-sample.js  # Static 12-product dataset
  utils/
    nlp.js               # Rule-based NLP parsing & ranking
  redux/
    action.js            # Cart actions
    reducer.js           # Cart reducer
public/
  images/                # Local product images


---

## Assumptions

* Product data is **local** for demo stability (no API calls).
* NLP parsing is **rule-based** (regex + keyword mapping).
* Images are stored locally to avoid broken links.
* “Good reviews” is interpreted as **rating ≥ 4.0**.

---

## AI Feature Chosen

**Option A – Smart Product Search (NLP)**
Implemented using a simple rule-based parser to handle natural language queries for category, price, and rating preferences.

---

