import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";

import localData from "../data/fakestore-sample"; 

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const dispatch = useDispatch();
  const addProduct = (p) => dispatch(addCart(p));

  useEffect(() => {
    setLoading(true);
    setLoading2(true);

    const current = localData.find((x) => String(x.id) === String(id));
    setProduct(current || null);
    setLoading(false);

    if (current) {
      const similars = localData
        .filter(
          (x) => x.category === current.category && String(x.id) !== String(id)
        )
        .slice(0, 8);
      setSimilarProducts(similars);
    } else {
      setSimilarProducts([]);
    }
    setLoading2(false);
  }, [id]);

  const Loading = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3">
          <Skeleton height={400} width={400} />
        </div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={90} />
          <Skeleton height={40} width={70} />
          <Skeleton height={50} width={110} />
          <Skeleton height={120} />
          <Skeleton height={40} width={110} inline />
          <Skeleton className="mx-3" height={40} width={110} />
        </div>
      </div>
    </div>
  );

  const ShowProduct = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 col-sm-12 py-3 text-center">
          <img
            className="img-fluid"
            src={product.image}
            alt={product.title}
            width="400"
            height="400"
            style={{ objectFit: "contain", maxHeight: 450 }}
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.jpg";
            }}
          />
        </div>
        <div className="col-md-6 py-5">
          <h4 className="text-uppercase text-muted">{product.category}</h4>
          <h1 className="display-5">{product.title}</h1>
          <p className="lead">
            {product.rating && product.rating.rate} <i className="fa fa-star"></i>
          </p>
          <h3 className="display-6 my-4">$ {product.price}</h3>
          <p className="lead">{product.description}</p>
          <button className="btn btn-outline-dark" onClick={() => addProduct(product)}>
            Add to Cart
          </button>
          <Link to="/cart" className="btn btn-dark mx-3">
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );

  const Loading2 = () => (
    <div className="my-4 py-4">
      <div className="d-flex">
        {[1, 2, 3, 4].map((k) => (
          <div className="mx-4" key={k}>
            <Skeleton height={400} width={250} />
          </div>
        ))}
      </div>
    </div>
  );

  const ShowSimilarProduct = () => (
    <div className="py-4 my-4">
      <div className="d-flex">
        {similarProducts.map((item) => (
          <div key={item.id} className="card mx-4 text-center" style={{ width: 250 }}>
            <img
              className="card-img-top p-3"
              src={item.image}
              alt={item.title}
              height={300}
              width={250}
              style={{ objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.jpg";
              }}
            />
            <div className="card-body">
              <h5 className="card-title">
                {item.title.length > 20 ? item.title.substring(0, 20) + "..." : item.title}
              </h5>
            </div>
            <div className="card-body">
              <Link to={"/product/" + item.id} className="btn btn-dark m-1">
                Buy Now
              </Link>
              <button className="btn btn-dark m-1" onClick={() => addProduct(item)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : product ? <ShowProduct /> : <p>Product not found.</p>}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            <Marquee pauseOnHover pauseOnClick speed={50}>
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
