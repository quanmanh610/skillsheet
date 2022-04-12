package vn.cmc.skillsheet.logic.impl;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Component;

import vn.cmc.skillsheet.constant.SystemConst;
import vn.cmc.skillsheet.logic.EncryptDecryptLogic;

/**
 * @author NDDUC
 *
 */
@Component
public class EncryptDecryptLogicImpl implements EncryptDecryptLogic {

    private SecretKeySpec skeySpec;

    public EncryptDecryptLogicImpl() {

        super();
        skeySpec = new SecretKeySpec(
                SystemConst.ENCRYPT_DECRYPT_CANDIDATE_LINK_SECRET_KEY.getBytes(),
                SystemConst.ENCRYPT_DECRYPT_CANDIDATE_LINK_ALGO);

    }

    @Override
    public String encrypt(final String data) throws Exception {

        Cipher c = Cipher.getInstance(SystemConst.ENCRYPT_DECRYPT_CANDIDATE_LINK_ALGO);
        c.init(Cipher.ENCRYPT_MODE, skeySpec);
        byte[] encVal = c.doFinal(data.getBytes());
        String encryptedValue = Base64.getEncoder().encodeToString(encVal);
        return encryptedValue;

    }

    @Override
    public String decrypt(final String encryptedData) throws Exception {

        Cipher c = Cipher.getInstance(SystemConst.ENCRYPT_DECRYPT_CANDIDATE_LINK_ALGO);
        c.init(Cipher.DECRYPT_MODE, skeySpec);
        byte[] decordedValue = Base64.getDecoder().decode(encryptedData);
        byte[] decValue = c.doFinal(decordedValue);
        String decryptedValue = new String(decValue);
        return decryptedValue;

    }

}
