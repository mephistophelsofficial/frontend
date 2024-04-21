import {setAuth, useAuth} from "../store/slices/auth";
import QRCode from "qrcode";
import {useEffect, useState} from "react";
import {isAuth, showAlert} from "../utils";
import {PATH} from "../consts";
import {useNavigate} from "react-router-dom";
import {Button, TextInput} from "@mantine/core";
import {useForm} from "../hooks";
import {axiosInstance} from "../api/instance";
import {useDispatch} from "react-redux";

export default function QRPage() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState('')
  const {values, email} = useForm({
    email: '',
  })

  useEffect(() => {
    if (challenge !== '') {
      const canvas = document.getElementById('qr-code');
      QRCode.toCanvas(canvas, challenge, function (error) {
        if (error) console.error(error);
      });
    }
  }, [challenge])

  useEffect(() => {

  }, [email]);

  const getChallenge = () => {
    axiosInstance.post('/public/web_auth/login', {...values})
      .then(res => res.data)
      .then(res => {
        setChallenge(res)
      })
      .catch(e => showAlert(e.response?.data?.message))
  }

  return (
    <div>
      <div style={centerS}>
        {
          challenge !== '' ?
            <>
              <label htmlFor="qr-code">Отсканируйте код с устройства, на котором вы авторизованы</label>
              <canvas style={canvasS} id="qr-code">
              </canvas>
            </> :
            <div style={{display: 'flex', alignItems: 'end', gap: 8}}>
              <TextInput
                label="Type your email"
                type="email"
                placeholder="email@mail.ru"
                required
                {...email}
              />
              <Button style={{padding: 13}} onClick={getChallenge}>
                >
              </Button>
            </div>
        }
      </div>
    </div>
  )
}


const centerS = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: '100vh'
}
const canvasS = {
  minWidth: '200px',
  minHeight: '200px',
}