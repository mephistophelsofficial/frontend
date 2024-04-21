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
  const [data, setData] = useState(null)
  const {values, email} = useForm({
    email: '',
  })

  const check_access = () => {
    axiosInstance.post('/waiting/web_auth/check_access', {...data}, {
      headers: {
        Authorization: `Bearer ${data.checkJwt}`
      }
    })
      .then(res => res.data)
      .then(r => {
        localStorage.setItem('accessJwt', r.accessJwt)
        showAlert(r.privateKey, 'alert-success')
        setTimeout(() => {
          navigate(PATH.HOME)
        }, 2000)
      })
      .catch(e => {
        if (e.response.data.message === "Session not confirmed") {
          setTimeout(check_access, 1000)
        } else {
          showAlert(e.response.data.message)
          navigate(PATH.LOGIN)
        }
      })
  }

  useEffect(() => {
    if (data != null) {
      const canvas = document.getElementById('qr-code');
      const qr = {
        sessionId: data.sessionId,
        challenge: data.challenge
      }
      QRCode.toCanvas(canvas, JSON.stringify(qr), function (error) {
        if (error) console.error(error);
      });
      check_access()
    }
  }, [data])

  const getChallenge = () => {
    axiosInstance.post('/public/web_auth/login', {...values})
      .then(res => res.data)
      .then(res => {
        setData(res)
      })
      .catch(e => showAlert(e.response?.data?.message))
  }

  return (
    <div>
      <div style={centerS}>
        {
          data != null ?
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