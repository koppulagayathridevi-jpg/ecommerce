import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();
    const navigate = useNavigate();

    const getProduct = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.log("No access token found");
                navigate("/login");
                return;
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/products/${id}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log("Status:", response.status);
            console.log("Product:", data);

            if (response.ok) {
                setProduct(data);
            } else {
                console.log("Failed to fetch product");
            }

        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProduct();
    }, [id]);

    if (loading) {
        return (
            <>
                <style>
                    {`
                        .loading-container {
                            min-height: 100vh;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background: #f5f7fa;
                            font-family: Arial, sans-serif;
                        }

                        .loading-container h2 {
                            color: #333;
                        }
                    `}
                </style>

                <div className="loading-container">
                    <h2>Loading product...</h2>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <style>
                    {`
                        .not-found {
                            min-height: 100vh;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            gap: 15px;
                            background: #f5f7fa;
                            font-family: Arial, sans-serif;
                        }

                        .back-btn {
                            padding: 10px 20px;
                            border: none;
                            border-radius: 6px;
                            background: #333;
                            color: white;
                            cursor: pointer;
                        }
                    `}
                </style>

                <div className="not-found">
                    <h2>Product not found</h2>

                    <button
                        className="back-btn"
                        onClick={() => navigate("/home")}
                    >
                        Back to Home
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Internal CSS */}
            <style>
                {`
                    .product-details-page {
                        min-height: 100vh;
                        padding: 40px 20px;
                        background: #f5f7fa;
                        font-family: Arial, sans-serif;
                    }

                    .product-details-container {
                        width: 100%;
                        max-width: 900px;
                        margin: 0 auto;
                        background: white;
                        padding: 35px;
                        border-radius: 15px;
                        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.10);
                    }

                    .back-button {
                        border: none;
                        background: #333;
                        color: white;
                        padding: 10px 18px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        margin-bottom: 25px;
                        transition: 0.3s;
                    }

                    .back-button:hover {
                        background: #555;
                    }

                    .product-title {
                        font-size: 32px;
                        color: #222;
                        margin-bottom: 20px;
                    }

                    .product-description {
                        color: #666;
                        line-height: 1.7;
                        margin-bottom: 25px;
                    }

                    .product-info {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                        margin-top: 20px;
                    }

                    .info-card {
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 10px;
                        border: 1px solid #e5e5e5;
                    }

                    .info-card strong {
                        display: block;
                        margin-bottom: 8px;
                        color: #555;
                        font-size: 14px;
                    }

                    .price {
                        font-size: 24px;
                        font-weight: bold;
                        color: #198754;
                    }

                    .stock {
                        font-size: 18px;
                        font-weight: bold;
                        color: #333;
                    }

                    .available {
                        font-size: 18px;
                        font-weight: bold;
                    }

                    .available-yes {
                        color: #198754;
                    }

                    .available-no {
                        color: #dc3545;
                    }

                    /* Tablet */
                    @media (max-width: 768px) {
                        .product-details-page {
                            padding: 25px 15px;
                        }

                        .product-details-container {
                            padding: 25px;
                        }

                        .product-title {
                            font-size: 28px;
                        }

                        .product-info {
                            grid-template-columns: 1fr;
                        }
                    }

                    /* Mobile */
                    @media (max-width: 480px) {
                        .product-details-page {
                            padding: 15px 10px;
                        }

                        .product-details-container {
                            padding: 20px 15px;
                            border-radius: 10px;
                        }

                        .product-title {
                            font-size: 24px;
                        }

                        .product-description {
                            font-size: 14px;
                        }

                        .info-card {
                            padding: 15px;
                        }

                        .price {
                            font-size: 21px;
                        }

                        .back-button {
                            width: 100%;
                        }
                    }
                `}
            </style>

            <div className="product-details-page">

                <div className="product-details-container">

                    <button
                        className="back-button"
                        onClick={() => navigate("/home")}
                    >
                        ← Back to Products
                    </button>

                    <h1 className="product-title">
                        {product.name}
                    </h1>

                    <p className="product-description">
                        <strong>Description:</strong>
                        <br />
                        {product.description}
                    </p>

                    <div className="product-info">

                        <div className="info-card">
                            <strong>Price</strong>
                            <span className="price">
                                ₹{product.price}
                            </span>
                        </div>

                        <div className="info-card">
                            <strong>Stock</strong>
                            <span className="stock">
                                {product.stock}
                            </span>
                        </div>

                        <div className="info-card">
                            <strong>Availability</strong>

                            <span
                                className={`available ${
                                    product.available
                                        ? "available-yes"
                                        : "available-no"
                                }`}
                            >
                                {product.available ? "Available" : "Out of Stock"}
                            </span>
                        </div>

                    </div>

                </div>

            </div>
        </>
    );
};

export default ProductDetails;