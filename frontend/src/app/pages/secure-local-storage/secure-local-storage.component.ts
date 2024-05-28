import CryptoJS from 'crypto-js';

export class SecureLocalStorage {

    // Clave secreta segura
    private secretKey = 'u9hu!c7M8R1lF4eW6hQ2xPz#T5j@Z%pH';

    encryptData(data: any): string {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    }

    decryptData(data: string): any {
      const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    setItem(key: string, data: any): void {
      const encryptedData = this.encryptData(data);
      localStorage.setItem(key, encryptedData);
    }

    getItem(key: string): any {
      const encryptedData = localStorage.getItem(key);

      if (encryptedData) {
        return this.decryptData(encryptedData);
      }

      return null;
    }

    removeItem(key: string): void {
      localStorage.removeItem(key);
    }
}
