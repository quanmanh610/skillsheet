package vn.cmc.skillsheet.logic;

public interface EncryptDecryptLogic {
    public String encrypt(String Data) throws Exception;

    public String decrypt(String encryptedData) throws Exception;
}
