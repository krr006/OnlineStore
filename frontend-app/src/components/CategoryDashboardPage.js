import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

function CategoryDashboardPage() {
    const [categories, setCategories] = useState([]);
    const [categoryData, setCategoryData] = useState({ name: '', description: '' });
    const [editState, setEditState] = useState({});
    const [editingCategoryData, setEditingCategoryData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

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

    const createCategory = async () => {
        try {
            await axios.post('http://localhost:8080/api/categories', categoryData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCategoryData({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    const deleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/categories/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const updateCategory = async (id, updatedCategory) => {
        try {
            await axios.put(`http://localhost:8080/api/categories/${id}`, updatedCategory, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setEditState((prevState) => ({ ...prevState, [id]: false }));
            fetchCategories();
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    };

    const handleEdit = (id, category) => {
        setEditState((prevState) => ({ ...prevState, [id]: true }));
        setEditingCategoryData({ ...category });
    };

    const handleSave = (id) => {
        updateCategory(id, editingCategoryData);
    };

    const handleChange = (e, field) => {
        setEditingCategoryData({ ...editingCategoryData, [field]: e.target.value });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <MDBContainer className="py-4">
            <h2 className="mb-4 text-center">Category Dashboard</h2>
            <MDBBtn className="mb-4" onClick={handleLogout}>Logout</MDBBtn>

            <MDBBtn className="mb-4" color="info" onClick={() => navigate('/products')}>Go to Products</MDBBtn>

            <h4>Create Category</h4>
            <MDBInput wrapperClass='mb-4' label='Name' value={categoryData.name} onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })} />
            <MDBInput wrapperClass='mb-4' label='Description' value={categoryData.description} onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })} />
            <MDBBtn className="mb-4" onClick={createCategory}>Create Category</MDBBtn>

            <h4>Category List</h4>
            <div className="d-flex flex-wrap">
                {categories.map(category => (
                    <MDBCard key={category.id} className="m-2" style={{ width: '300px' }}>
                        <MDBCardBody>
                            {editState[category.id] ? (
                                <>
                                    <MDBInput wrapperClass='mb-4' label='Name' value={editingCategoryData.name} onChange={(e) => handleChange(e, 'name')} />
                                    <MDBInput wrapperClass='mb-4' label='Description' value={editingCategoryData.description} onChange={(e) => handleChange(e, 'description')} />
                                    <MDBBtn color="success" className="me-2" onClick={() => handleSave(category.id)}>Save</MDBBtn>
                                    <MDBBtn color="warning" className="me-2" onClick={() => setEditState({ ...editState, [category.id]: false })}>Cancel</MDBBtn>
                                </>
                            ) : (
                                <>
                                    <MDBCardTitle>{category.name}</MDBCardTitle>
                                    <MDBCardText>{category.description}</MDBCardText>
                                    <MDBBtn color="primary" className="me-2" onClick={() => handleEdit(category.id, category)}>Edit</MDBBtn>
                                </>
                            )}
                            <MDBBtn color="danger" onClick={() => deleteCategory(category.id)}>Delete</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                ))}
            </div>
        </MDBContainer>
    );
}

export default CategoryDashboardPage;
