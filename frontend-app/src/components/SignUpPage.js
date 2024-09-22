import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    MDBContainer,
    MDBInput,
} from 'mdb-react-ui-kit';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            if (!email || !username || !password) {
                setError('Please fill in all fields.');
                return;
            }

            const response = await axios.post('http://localhost:8080/auth/register', {
                username,
                email,
                password
            });

            console.log('Signup successful:', response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/products');
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || error.response.data.error || 'Registration failed.';
                setError(errorMessage);
            } else {
                setError('Registration failed.');
            }
            console.error('Signup failed:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{ width: '600px' }}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Sign Up Page</h2>
                    {error && <p className="text-danger">{error}</p>}
                    <MDBInput wrapperClass='mb-3' placeholder='Email Address' id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <MDBInput wrapperClass='mb-3' placeholder='Username' id='username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <MDBInput wrapperClass='mb-3' placeholder='Password' id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="mb-4 d-block btn-primary" style={{ height: '50px', width: '100%' }} onClick={handleSignup}>Sign Up</button>
                    <div className="text-center">
                        <p>Already a member? <a href="/">Login</a></p>
                    </div>
                </MDBContainer>
            </div>
        </div>
    );
}

export default SignUpPage;
