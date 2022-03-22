import {
  createCipheriv,
  createDecipheriv,
  createHash,
  pbkdf2,
  randomBytes,
  randomUUID,
} from 'crypto';
const algorithm = 'aes-256-cbc';
const iv = randomBytes(16);
export type Edge<T> = {
  node: T;
  cursor: string;
};
export function secretMask(cc: string, num = 4, len = 32, mask = '*'): string {
  return cc.slice(-num).padStart(len, mask);
}

export function JSON2Object<T>(jsonStringy: string, defaultValue = {}): T {
  try {
    defaultValue = JSON.parse(jsonStringy);
  } catch (error) {}

  return defaultValue as T;
}

export function randomTimeStampSeconds(min: number, max: number) {
  return parseInt(Math.random() * (max - min) + min + '');
}

export function hasPreviousPage<T>(
  allEdges: Edge<T>[],
  after: string,
  last: number,
): boolean {
  if (last) {
    return allEdges.length > last;
  }
  if (after) {
    return allEdges.length > 0;
  }
  return false;
}

export function hasNextPage<T>(
  allEdges: Edge<T>[],
  before: string,
  first: number,
): boolean {
  if (first) {
    return allEdges.length > first;
  }
  if (before) {
    return allEdges.length > 0;
  }
  return false;
}

/**
 * 生成字符串模版
 */
export const generateTemplateString = (function () {
  const cache = {};

  function generateTemplate(template) {
    let fn = cache[template];

    if (!fn) {
      // Replace ${expressions} (etc) with ${map.expressions}.

      const sanitized = template
        .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function (_, match) {
          return `\$\{map.${match.trim()}\}`;
        })
        // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
        .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

      fn = cache[template] = Function('map', `return \`${sanitized}\``);
    }

    return fn;
  }

  return generateTemplate;
})();

export function encrypt(key, text) {
  // Creating Cipheriv with its parameter
  const cipher = createCipheriv(algorithm, Buffer.from(key), iv);

  // Updating text
  let encrypted = cipher.update(text);

  // Using concatenation
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Returning iv and encrypted data
  const ivStr: string = iv.toString('hex');
  const encryptedData: string = encrypted.toString('hex');
  return `${encryptedData}:${ivStr}`;
}

export function decrypt(key, encryptedDataParam) {
  if (!encryptedDataParam) {
    return '';
  }
  const [encryptedData, textIv] = encryptedDataParam.split(':');
  const bufferIV = Buffer.from(textIv, 'hex');
  const encryptedText = Buffer.from(encryptedData, 'hex');
  // Creating Decipher
  const decipher = createDecipheriv(algorithm, Buffer.from(key), bufferIV);

  // Updating encrypted text
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export function btoa(botaStr): string {
  return Buffer.from(botaStr).toString('base64');
}

export function atob(b64Encoded): string {
  return Buffer.from(b64Encoded, 'base64').toString();
}

export function joinKey(...keys: string[]) {
  return keys.reduce((total, cur) => {
    return total + ':' + cur;
  });
}

/**
 *
 * @param defaultStr
 * @param salt
 * @returns
 */
export function md5(defaultStr = '', salt = ''): string {
  const saltStr = `${defaultStr}:${salt}`;
  const md5 = createHash('md5');
  return md5.update(saltStr).digest('hex');
}
/**
 * pbkdf2 加密
 * @param userPassword
 * @returns
 */
export function encryptedWithPbkdf2(userPassword: string): Promise<string> {
  //盐值随机
  const salt = randomUUID();
  let primaryDriverKey = '';
  return new Promise((resolve, reject) => {
    pbkdf2(userPassword, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        primaryDriverKey = '';
        reject(primaryDriverKey);
      } else {
        primaryDriverKey = derivedKey.toString('hex');
        resolve(primaryDriverKey);
      }
    });
  });
}
