import {
    TextInput,
    Button,
    Space,
} from '@mantine/core';
import { useForm } from '../../hooks';
import {useNavigate} from "react-router-dom";
import {PATH} from "../../consts";
const Login = ({
    submit
}) => {
  const navigate = useNavigate()

    const {values, email, password} = useForm({
        email: '',
        password: '',
    })

    return (
        <form onSubmit={e => {e.preventDefault(); submit(values)}} style={{paddingBottom: '20px'}}>
            <TextInput
                label="Email"
                type="email"
                placeholder="you@mantine.dev"
                required
                {...email}
            />
            <Space h='md'/>
            <TextInput
                label="password"
                type="password"
                placeholder="Your password"
                required
                {...password}
            />
            <Space h='xl'/>
            <Button type="submit" color="#FA5252" fullWidth>
                Sign in
            </Button>
            <Space h='md'/>
            <Button type="submit" color="#50C878" fullWidth onClick={() => {
              navigate(PATH.QR)
            }}>
              Or Sign in with webauthn
            </Button>
        </form>
    )
}

export default Login