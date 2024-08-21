import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ProfileScreen = () => {
    const [data, setData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        is_active: ""
    });

    const url = 'http://127.0.0.1:8000/api/user/profile/';

    const token = localStorage.getItem('jwt');

    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    useEffect(() => {
        axios
          .get(url, {headers}) 
          .then((res) => {
            setData(() => {
              return res.data;
            });
          }) 
          .catch((err) => {
            console.log(err);
          }); 
      }, [url]);

    const updateUser = async (e) => {
        e.preventDefault();
        const {first_name, last_name, email, password, phone} = data;

        try {
            const { data } = await axios.patch('http://127.0.0.1:8000/api/user/profile/', {
                first_name,
                last_name,
                email,
                password,
                phone
            }, {headers})
            if (data.error) {
                toast.error("Error! Try again");
            } else {
                toast.success("Update successful");
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
    <>
    <Link className='btn btn-light my-3' to='/'>
                Go Back
    </Link>
    <Row>
      <Col md={3}>
        <Form onSubmit={updateUser} style={{ width: "24rem", margin: "50px" }}>
          <Form.Group className='my-2' controlId='first_name'>
            <Form.Label>First name</Form.Label>
            <Form.Control
              type='first_name'
              placeholder='Enter first name'
              value={data.first_name}
              onChange={(e) => setData({...data, first_name : e.target.value})}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='last_name'>
            <Form.Label>Last name</Form.Label>
            <Form.Control
              type='last_name'
              placeholder='Enter last name'
              value={data.last_name}
              onChange={(e) => setData({...data, last_name : e.target.value})}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={data.email}
              onChange={(e) => setData({...data, email : e.target.value})}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={data.password}
              onChange={(e) => setData({...data, password : e.target.value})}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='phone'>
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type='phone'
              placeholder='Enter phone number'
              value={data.phone}
              onChange={(e) => setData({...data, phone : e.target.value})}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>

      <Col md={2}>
      </Col>

      <Col md={6}>
        
        <h2>User Profile</h2>
        
        <Card style={{ width: "24rem", margin: "20px", top: "20px" }} className='my-3 p-3 rounded'>
      
      <Card.Body>
          <Card.Title  >
            <strong>Name: { data.first_name } { data.last_name } </strong> 
          </Card.Title>
        
        <Card.Text>
            <strong>Email:</strong>   <span> { data.email } </span>
        </Card.Text>
        <Card.Text >
        <strong>Phone:</strong> { data.phone }
        </Card.Text>
        <Card.Text >
        <strong>Status: </strong>{ data.is_active ?  <span className='text-success'>Active</span> : <span className='text-danger'>Not Active</span>}
        </Card.Text>        
      </Card.Body>
    </Card>
      </Col>
    </Row>
  </>  
  );
};

export default ProfileScreen;