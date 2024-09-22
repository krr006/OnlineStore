import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

function ProductDashboardPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productData, setProductData] = useState({ name: '', description: '', price: '', categoryId: '' });
    const [searchParams, setSearchParams] = useState({ name: '', categoryId: '', minPrice: '', maxPrice: '' });
    const [editState, setEditState] = useState({});
    const [editingProductData, setEditingProductData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const createProduct = async () => {
        try {
            await axios.post('http://localhost:8080/api/products', productData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProductData({ name: '', description: '', price: '', categoryId: '' });
            fetchProducts();
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const searchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products/search', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    name: searchParams.name || undefined,
                    categoryId: searchParams.categoryId || undefined,
                    minPrice: searchParams.minPrice || undefined,
                    maxPrice: searchParams.maxPrice || undefined,
                },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to search products:', error);
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        try {
            await axios.put(`http://localhost:8080/api/products/${id}`, updatedProduct, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setEditState((prevState) => ({ ...prevState, [id]: false }));
            fetchProducts();
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    const handleEdit = (id, product) => {
        setEditState((prevState) => ({ ...prevState, [id]: true }));
        setEditingProductData({ ...product });
    };

    const handleSave = (id) => {
        const updatedProduct = { ...editingProductData, price: parseFloat(editingProductData.price) };
        updateProduct(id, updatedProduct);
    };

    const handleChange = (e, field) => {
        setEditingProductData({ ...editingProductData, [field]: e.target.value });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const goToCategories = () => {
        navigate('/categories');
    };

    return (
        <MDBContainer className="py-4">
            <h2 className="mb-4 text-center">Product Dashboard</h2>
            <MDBBtn className="mb-4" onClick={handleLogout}>Logout</MDBBtn>
            <MDBBtn className="mb-4" onClick={goToCategories}>Manage Categories</MDBBtn>

            <h4>Create Product</h4>
            <MDBInput wrapperClass='mb-4' label='Name' value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} />
            <MDBInput wrapperClass='mb-4' label='Description' value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} />
            <MDBInput wrapperClass='mb-4' label='Price' type='number' value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} />

            <select
                className="mb-4 form-select"
                value={productData.categoryId || ""}
                onChange={(e) => setProductData({ ...productData, categoryId: e.target.value })}
            >
                <option value="">Select Category</option> {/* Добавлено пустое значение */}
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>

            <MDBBtn className="mb-4" onClick={createProduct}>Create Product</MDBBtn>

            <h4>Search Products</h4>
            <MDBInput wrapperClass='mb-4' label='Search by Name' value={searchParams.name} onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })} />
            <select
                className="mb-4 form-select"
                value={searchParams.categoryId || ""}
                onChange={(e) => setSearchParams({ ...searchParams, categoryId: e.target.value })}
            >
                <option value="">Select Category</option> {/* Добавлено пустое значение */}
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <MDBInput wrapperClass='mb-4' label='Min Price' type='number' value={searchParams.minPrice} onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })} />
            <MDBInput wrapperClass='mb-4' label='Max Price' type='number' value={searchParams.maxPrice} onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })} />
            <MDBBtn className="mb-4" onClick={searchProducts}>Search</MDBBtn>

            <h4>Product List</h4>
            <div className="d-flex flex-wrap">
                {products.map(product => (
                    <MDBCard key={product.id} className="m-2" style={{ width: '300px' }}>
                        <MDBCardBody>
                            {editState[product.id] ? (
                                <>
                                    <MDBInput wrapperClass='mb-4' label='Name' value={editingProductData.name} onChange={(e) => handleChange(e, 'name')} />
                                    <MDBInput wrapperClass='mb-4' label='Description' value={editingProductData.description} onChange={(e) => handleChange(e, 'description')} />
                                    <MDBInput wrapperClass='mb-4' label='Price' type='number' value={editingProductData.price} onChange={(e) => handleChange(e, 'price')} />

                                    <select
                                        className="mb-4 form-select"
                                        value={editingProductData.categoryId || ""}
                                        onChange={(e) => handleChange(e, 'categoryId')}
                                    >
                                        <option value="">Select Category</option> {/* Добавлено пустое значение */}
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                    <MDBBtn color="success" className="me-2" onClick={() => handleSave(product.id)}>Save</MDBBtn>
                                    <MDBBtn color="warning" className="me-2" onClick={() => setEditState({ ...editState, [product.id]: false })}>Cancel</MDBBtn>
                                </>
                            ) : (
                                <>
                                    <MDBCardTitle>{product.name}</MDBCardTitle>
                                    <MDBCardText>
                                        <strong>Description:</strong> {product.description} <br />
                                        <strong>Price:</strong> {product.price} <br />
                                        <strong>Category:</strong> {product.category.name} <br />
                                        <strong>Created At:</strong> {new Date(product.createdAt).toLocaleDateString()} <br />
                                    </MDBCardText>
                                    <MDBBtn color="primary" className="me-2" onClick={() => handleEdit(product.id, product)}>Edit</MDBBtn>
                                </>
                            )}
                            <MDBBtn color="danger" onClick={() => deleteProduct(product.id)}>Delete</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                ))}
            </div>
        </MDBContainer>
    );
}

export default ProductDashboardPage;
