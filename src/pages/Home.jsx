import {isAuth, showAlert} from "../utils";
import {useNavigate} from "react-router-dom";
import {PATH} from "../consts";
import {useEffect} from "react";
import {Button} from "@mantine/core";
import {axiosInstance} from "../api/instance";
// import {axiosInstance} from "../api/instance";
const forge = require('node-forge');
// async function generateKeyPair() {
//   const keyPair = await window.crypto.subtle.generateKey({
//       name: "RSA-OAEP",
//       modulusLength: 2048, // Длина ключа
//       publicExponent: new Uint8Array([1, 0, 1]),
//       hash: {name: "SHA-256"},
//     },
//     true,
//     ["encrypt", "decrypt"]);
//   const publicKey = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
//   const privateKey = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);
//
//   return { publicKey, privateKey };
// }
function generateKeyPair() {
  return new Promise((resolve, reject) => {
    forge.pki.rsa.generateKeyPair({ bits: 2048, workers: -1 }, function(err, keypair) {
      if (err) {
        reject(err);
      } else {
        if (!keypair.privateKey || !keypair.publicKey) {
          reject(new Error("Failed to generate key pair"));
        } else {
          resolve(keypair);
        }
      }
    });
  });
}

function stripPemHeaders(pemString) {
  return pemString
    .replace(/-----BEGIN [^-]+-----/, '') // Удалить начальный заголовок
    .replace(/-----END [^-]+-----/, '')   // Удалить конечный заголовок
    .replace(/\s+/g, '');                 // Удалить все пробелы и переносы строк
}

export default function Home () {
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuth()) {
      navigate(PATH.LOGIN)
    }
  })
  const registerWebauthn = async () => {
      const keyPair = await generateKeyPair();
      let privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
      let publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
      privateKey = stripPemHeaders(privateKey)
      publicKey = stripPemHeaders(publicKey)
      console.log(privateKey, publicKey)
      const response = await axiosInstance.post('/web_auth/registration', {
        privateKey: privateKey,
        publicKey: publicKey
      }, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('accessJwt')}`
        }
      });
      showAlert(response.data, 'alert-success');
  }
  return (
    <div style={centerS}>
      <h2>Успешно авторизован!</h2>
      <div>
        <Button onClick={registerWebauthn}>
          Register webauthn
        </Button>
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