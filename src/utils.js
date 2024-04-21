/**
 *
 * @param message
 * @param variant 'alert-danger' | 'alert-success' | 'alert-warning'
 */
export const showAlert = (message, variant) => {
    // Create a div element
    const alertDiv = document.createElement('div');

    // Apply class and message
    alertDiv.className = variant || 'alert-danger';
    alertDiv.innerText = message;

    // Append to body
    document.body.appendChild(alertDiv);

    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(alertDiv);
    }, 2000);
}
export function useWebAuthn({
                                rpName,
                                rpId,
                                credentialOpt,
                                assertionOpt,
                            }) {
    const getCredential = async ({
                                     userId,
                                     userName,
                                     userDisplayName,
                                     challenge,
                                 }) => {
        const publicKeyCredentialCreationOptions = {
            rp: {
                name: rpName,
                id: rpId,
            },
            user: {
                id: Uint8Array.from(userId, (c) => c.charCodeAt(0)),
                name: userName,
                displayName: userDisplayName,
            },
            challenge: Uint8Array.from(challenge, (c) => c.charCodeAt(0)),
            pubKeyCredParams: [
                {
                    type: 'public-key',
                    alg: -7,
                },
                {
                    type: 'public-key',
                    alg: -257,
                },
            ],
            timeout: 60000,
            excludeCredentials: [],
            authenticatorSelection: {
                residentKey: 'preferred',
                requireResidentKey: false,
                userVerification: 'required',
            },
            attestation: 'none',
            extensions: {
                credProps: true,
            },
            ...credentialOpt,
        };
        return await navigator.credentials.create({
            publicKey: publicKeyCredentialCreationOptions,
        });
    };
    const getAssertion = async ({ challenge }) => {
        const publicKeyCredentialRequestOptions = {
            challenge: Uint8Array.from(challenge, (c) => c.charCodeAt(0)),
            allowCredentials: [],
            rpId: rpId,
            timeout: 60000,
            userVerification: 'required',
            ...assertionOpt,
        };
        return await navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOptions,
        });
    };
    return { getCredential, getAssertion };
}


export function isAuth() {
    return Boolean(window.localStorage.getItem('accessJwt'))
}