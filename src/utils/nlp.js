// 解析自然语言意图：价格区间、类别、好评偏好（映射到 fakestore 四大类）
export function parseQuery(q) {
  const s = (q || "").toLowerCase();
  const out = {};

  let m = s.match(/(?:between|from)\s*\$?(\d+(?:\.\d+)?)\s*(?:and|to)\s*\$?(\d+(?:\.\d+)?)/);
  if (m) { out.minPrice = +m[1]; out.maxPrice = +m[2]; }
  m = s.match(/(?:under|below|less than)\s*\$?(\d+(?:\.\d+)?)/);
  if (m) out.maxPrice = +m[1];
  m = s.match(/(?:over|above|more than)\s*\$?(\d+(?:\.\d+)?)/);
  if (m) out.minPrice = +m[1];

  if (/(men|male).*(cloth)|men's clothing/.test(s)) out.category = "men's clothing";
  if (/(women|female|lady).*(dress|cloth)|women's clothing/.test(s)) out.category = "women's clothing";
  if (/jewel|necklace|ring|bracelet/.test(s)) out.category = "jewelery";
  if (/electronic|headphone|laptop|camera|mouse|watch/.test(s)) out.category = "electronics";

  out.wantGoodReviews = /(good review|highly rated|best|top|excellent)/.test(s);

  return out;
}

export function rank(products, query) {
  const intent = parseQuery(query);

  let list = products.filter(p => {
    if (intent.category && p.category !== intent.category) return false;
    if (intent.minPrice != null && p.price < intent.minPrice) return false;
    if (intent.maxPrice != null && p.price > intent.maxPrice) return false;
    return true;
  });

  const toks = (query || "").toLowerCase().split(/\W+/).filter(t => t.length > 2);

  return list.map(p => {
    let score = 0;
    if (intent.category && p.category === intent.category) score += 2;
    if (intent.wantGoodReviews && p.rating?.rate) score += Math.max(0, p.rating.rate - 3.5);
    const hay = (p.title + " " + p.description).toLowerCase();
    toks.forEach(t => { if (hay.includes(t)) score += 0.3; });
    return { ...p, _score: score };
  }).sort((a,b) => b._score - a._score);
}
