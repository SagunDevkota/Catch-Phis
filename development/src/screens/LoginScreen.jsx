import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const LoginScreen = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = data;

        try {
            const { data } = await axios.post('http://127.0.0.1:8000/api/user/token/', {
                email,
                password
            })
            if (data.error) {
                toast.error("Error! Try again")
            } else {
                setData({});
                toast.success("Login successful");
                localStorage.setItem('jwt', data.access);
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response.data.detail);
        }
    }
    return (
        <FormContainer>
            <h1>Sign In</h1>

            <Form onSubmit={loginUser}>
                <Form.Group controlId='email' className='my-3'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={data.email}
                        onChange={(e) => setData({...data, email : e.target.value})}
                    ></Form.Control>    
                </Form.Group>

                <Form.Group controlId='password' className='my-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={data.password}
                        onChange={(e) => setData({...data, password : e.target.value})}
                    ></Form.Control>    
                </Form.Group>

                <Button type='submit' variant='primary' className='mt-2'>
                    Sign In
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer? 
                    <Link to='/register' className='reg-link'>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};
export default LoginScreen;