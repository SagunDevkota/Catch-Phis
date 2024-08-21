import {React, useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {  Navbar, Nav, Container, NavDropdown} from 'react-bootstrap';
import { FaShoppingCart, FaUser} from 'react-icons/fa';

const Header = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        first_name: "",
        last_name: ""
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

    const handleLogout = (e) => {
        try {
            localStorage.removeItem('jwt');
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }


    return (
      <header>
          <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
              <Container>
                  <Navbar.Brand>
                      <Link to='/' className='link'>
                      CatchFish
                      </Link>
                      </Navbar.Brand>
                  <Navbar.Toggle aria-controls='basix-navbar-nav' />
                  <Navbar.Collapse id='basic-navbar-nav'>
                      <Nav className='ms-auto'>
                              <Nav.Link>
                                <Link to='/cart' className='link'>
                                  <FaShoppingCart /> Cart 
                                </Link>  
                              </Nav.Link>  
                              
                              <Nav.Link>
                                {
                                    localStorage.getItem('jwt') ? (    
                                        <Link to='/profile' className='link'>
                                  <FaUser/> {data.first_name} {data.last_name} </Link>
                                    ) : (
                                        <Link to='/login' className='link'>
                                  <FaUser/> Sign In </Link>
                                    )
                                } 
                              </Nav.Link>
                              <NavDropdown title='' id='username'>
                                <NavDropdown.Item> 
                                {
                                    localStorage.getItem('jwt') ? (
                                    <Link to='/profile' className='product-link'>    
                                        Profile
                                    </Link>) : (
                                    <Link to='/login' className='product-link'>    
                                        Profile
                                    </Link>
                                )}
                                </NavDropdown.Item>

                              </NavDropdown>
                      </Nav>
                  </Navbar.Collapse>
              </Container>
          </Navbar>
      </header>
  );
};

export default Header;