import { Crypt } from 'hybrid-crypto-js';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHEjNBilmFc6mak7sGM+pGvy00w5
upM9D+MuSbN1/XtUsIhgwvi/YubMw3boHmCe4/wKDU9LcVkvlLDox7QncxApdGNl
/PIiCQ4Twf03+2VnRBqV6HMFuk3rENR0+Obh4Pl8MfPDDpxgQlXN2BrZQZHFezat
5D4jIPOyopvIAg8/AgMBAAE=
-----END PUBLIC KEY-----`;

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgHEjNBilmFc6mak7sGM+pGvy00w5upM9D+MuSbN1/XtUsIhgwvi/
YubMw3boHmCe4/wKDU9LcVkvlLDox7QncxApdGNl/PIiCQ4Twf03+2VnRBqV6HMF
uk3rENR0+Obh4Pl8MfPDDpxgQlXN2BrZQZHFezat5D4jIPOyopvIAg8/AgMBAAEC
gYAqhOZxVNq5/aX+OhaCVeqJP0s13IRIDazI3n6IWZGYJi3qMyNTROowf0f+iiHQ
giaAdG6oHFxO/ljNW86h4CmXq3CVkVUrLak7Xv5BFLoURroqkeoNGSWhNPvKbyqH
ybVFPul9ft8n+C1Ew9cWFvxeWpjWkEDRUM5EClFwTVImQQJBAKtGhAzKBnDxo88y
tWTgEIkFv1HYie8z0uOmsE+8OYplFqRsnZB1l1mVzq5h3TV7fh+7p63Gv8Vyu8UH
UAysqNECQQCpGmJKbpjC3FNremNg/cLTky1toYnOQoWlJBfEUJ+T7GZX+0Fyo0Jb
SaGS9at7IQzm97GptRTqAGdxUphOPDsPAkAXsiLUziKD/7plESPtd95xxpzIiwfS
Uz4rBsW/0k+3qPKv/uLxuIMe/s3gbGO5YYN6inDRZvzjKVN3F+LoTf7xAkEAo5gc
wvlf3BQet/m9LtYQp3LZHhiLIvoEJRFX1NpSp16qXC98z5TV207Oe0gkT4hX3RJ/
1DiVNRSS/nTzV6y5TQJBAJkVy13m9uH2OBPW0jXtbg8FCpgUZkKtzVFPBIz5IUOS
ttQmF0zKQLbMlK7X3Nbrbv/7WYSpT1wL7Po/vcR77fs=
-----END RSA PRIVATE KEY-----`

export const encryptMessage = (input) => {
    let message = unescape(encodeURIComponent(JSON.stringify(input)));;
    const crypt = new Crypt();
    const encrypted = crypt.encrypt(publicKey, message);
    message = window.btoa(encrypted);
    return message;
}

export const decryptMessage = (input) => {
    try {
        let message = window.atob(input);
        const crypt = new Crypt();
        const decrypted = crypt.decrypt(privateKey, message);
        let output = decodeURIComponent(escape(decrypted.message));
        return output;
    } catch (error) {
        console.log('decryptMessage', error);
        return '';
    }
}