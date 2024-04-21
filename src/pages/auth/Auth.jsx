import { Container, Group, Button } from '@mantine/core'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { PATH } from '../../consts';
import Login from './LoginForm';
import RegistrationForm from './RegistrationForm';
import { api } from '../../api';
import './Auth.css';
import { theme } from '../../index';
import {setAuth} from "../../store/slices/auth";
import {useDispatch} from "react-redux";
import {axiosInstance} from "../../api/instance";
import {showAlert} from "../../utils";

const Nav = ({isRegistration}) => {
  const navigate = useNavigate();
  return (
    <Group grow justify='space-between' gap={0}>
      <Button
        style={{width: '50%'}}
        size='md'
        radius={0}
        color={!isRegistration ? 'red' : theme.colors.button[0]}
        onClick={() => navigate(PATH.LOGIN)}
      >Логин</Button>
      <Button 
        style={{width: '50%'}}
        size='md' 
        radius={0}
        color={isRegistration ? 'red' : theme.colors.button[0]}
        onClick={() => navigate(PATH.REGISTRATION)}
      >Регистрация</Button>
    </Group>
  );

}


const Auth = () => {

  const path = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const navigateTo = () => navigate('/home')

  const login = (data) => {
    axiosInstance.post('/public/auth/login', {...data})
      .then(res => res.data)
      .then(res => {
        window.localStorage.setItem('accessJwt', res.accessJwt)
        navigate(PATH.HOME)
      })
      .catch(e => showAlert(e.response?.data?.message))
  }

  return (
    <div /*className='bg'*/>
      <div>
      <Container size={620} my={40} mt='250px' p={0} className='container-shadow' style={{backgroundColor: 'white'}}>
          <Nav isRegistration={path === PATH.REGISTRATION}/>
          <br/>
          <Container style={{backgroundColor: 'white'}}>
            <div style={{width: '100%'}}>
              {path === PATH.LOGIN && <Login submit={login}/>}
              {path === PATH.REGISTRATION && <RegistrationForm />}
            </div>
          </Container>
      </Container>
      </div>
    </div>
  )
}

export default Auth