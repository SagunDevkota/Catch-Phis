import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-hot-toast';

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    first_name : "",
    last_name : "",
    email: "",
    password: "",
    phone: ""
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email, password, phone } = data;

    try {
        const { data } = await axios.post('http://127.0.0.1:8000/api/user/create/', {
            first_name,
            last_name,
            email,
            password,
            phone
        })
    if (data.error) {
        toast.error("Error! Try again")
    } else {
        console.log("**" + data)
        setData({});
        toast.success("Registration successful")
        navigate('/login')
    }
    } catch (error) {
        const { email, password, non_field_errors } = error.response.data
        if (email) {
            toast.error(email[0])
        } else if(password) {
            toast.error(password[0])
        } else
            {
        toast.error(non_field_errors[0])
        }
    }
  }
    return (
        <FormContainer>
            <h1>Sign Up</h1>

            <Form onSubmit={registerUser}>
                <Form.Group controlId='first_name' className='my-3'>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter first name'
                        value={data.first_name}
                        onChange={(e) => setData({...data, first_name : e.target.value})}
                    ></Form.Control>    
                </Form.Group>

                <Form.Group controlId='last_name' className='my-3'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter last name'
                        value={data.last_name}
                        onChange={(e) => setData({...data, last_name : e.target.value})}
                    ></Form.Control>    
                </Form.Group>

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

                <Form.Group controlId='phone' className='my-3'>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter phone number'
                        value={data.phone}
                        onChange={(e) => setData({...data, phone : e.target.value})}
                    ></Form.Control>    
                </Form.Group>

                <Button
                    type='submit'
                    variant='primary'
                    className='mt-2'
                >
                    Register
                </Button>

            </Form>

            <Row className='py-3'>
                <Col>
                    Already have an account? 
                       <Link to='/login' className='login-link'> Login </Link>
                </Col>
            </Row>
        </FormContainer>
    );
};
export default RegisterScreen;