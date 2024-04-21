import {
    TextInput,
    Button,
    Group,
    InputLabel,
    Space,
    Checkbox,
} from '@mantine/core';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { theme } from '../../index';
import { useForm } from '../../hooks';
import {useCallback, useEffect, useState} from "react";
import {isAuth, showAlert, useWebAuthn} from "../../utils";
import {api} from "../../api";
import axios from "axios";
import {axiosInstance} from "../../api/instance";
import {setAuth} from "../../store/slices/auth";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {PATH} from "../../consts";

const rpOptions = {
    rpId: 'localhost',
    rpName: 'my super app'
}
const RegistrationFrom = () => {

    const {values, email, password, name} = useForm({
        email: '',
        password: '',
        name: '',
    });
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {getCredential, getAssertion} = useWebAuthn(rpOptions)

    const onRegister = useCallback(async () => {
        // Simulate fetching a binary-safe challenge from the server
        const challenge = 't'; // This should ideally come from the server
        const credential = await getCredential({
            challenge,
            userDisplayName: email,
            userId: email,
            userName: email
        });
        console.log(credential);
    }, [getCredential, email]);


    function simpleRegister() {
        axiosInstance.post('/public/auth/registration', {...values})
          .then(res => res.data)
          .then(res => {
              window.localStorage.setItem('accessJwt', res.accessJwt)
              navigate(PATH.HOME)
          })
          .catch(e => showAlert(e.response?.data?.message))
    }


    return (
        <>
            <form style={{paddingBottom: '20px'}} onSubmit={e => {
                e.preventDefault()
                simpleRegister()
            }}>
                <TextInput
                    {...email}
                    label="Email"
                    type="email"
                    placeholder="you@mantine.dev"
                    required
                />
                <Space h='sm'/>
                <TextInput
                    {...password}
                    label="password"
                    type="password"
                    placeholder="Your password"
                    required
                />
                <Space h='sm'/>
                <TextInput
                  {...name}
                  label="name"
                  type="text"
                  placeholder="Your name"
                  required
                />
                <Space h='sm'/>
                <Button type="submit" fullWidth >
                    Registration
                </Button>
            </form>
        </>
    )
}

export default RegistrationFrom;