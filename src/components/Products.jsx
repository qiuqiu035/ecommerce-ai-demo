import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import localData from "../data/fakestore-sample";
import { parseQuery, rank } from "../utils/nlp";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);
  const [keyword, setKeyword] = useState("");
  const [nlQuery, setNlQuery] = useState("");
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    setLoading(true);
    setData(localData);
    setFilter(localData); // 默认显示全部
    setLoading(false);
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    if (!cat) {
      setFilter(data);
      return;
    }
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    const base = filter
      .filter((p) => p.price <= maxPrice)
      .filter((p) => {
        const s = keyword.toLowerCase();
        if (!s) return true;
        return (
          p.title.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
        );
      });

    const finalList = nlQuery.trim() ? rank(base, nlQuery) : base;

    return (
      <>
        {/* 分类按钮 */}
        <div className="buttons text-center py-4">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct(null)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {/* 基础筛选：关键字 + 价格；AI：自然语言搜索 */}
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 my-2">
          {/* 普通关键字搜索 */}
          <input
            className="form-control"
            style={{ maxWidth: 320 }}
            placeholder="按名称/描述搜索…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          {/* 价格滑条 */}
          <div className="d-flex align-items-center ms-2">
            <span className="me-2">Max Price:</span>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <span className="ms-2">${maxPrice}</span>
          </div>

          {/* 自然语言（AI）搜索 */}
          <input
            className="form-control"
            style={{ maxWidth: 420 }}
            placeholder="试试: men's clothing under $50 with good reviews"
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
          />
        </div>

        {/* 可选：展示解析意图，方便录屏讲解 */}
        {nlQuery.trim() && (
          <pre
            style={{
              background: "#fafafa",
              padding: "8px 12px",
              border: "1px solid #eee",
              marginTop: 8,
            }}
          >
            Parsed intent: {JSON.stringify(parseQuery(nlQuery), null, 2)}
          </pre>
        )}

        {/* 列表渲染 */}
        {finalList.map((product) => (
          <div
            id={product.id}
            key={product.id}
            className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
          >
            <div className="card text-center h-100" key={product.id}>
              <img
                className="card-img-top p-3"
                src={product.image}
                alt={product.title}
                height={300}
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Category: {product.category}</li>
                <li className="list-group-item">
                  Rating: {product.rating?.rate} ⭐
                </li>
                <li className="list-group-item lead">$ {product.price}</li>
              </ul>
              <div className="card-body">
                <Link to={"/product/" + product.id} className="btn btn-dark m-1">
                  Buy Now
                </Link>
                <button
                  className="btn btn-dark m-1"
                  onClick={() => {
                    toast.success("Added to cart");
                    addProduct(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Latest Products</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};


export default Products;
