import { createCipheriv, createDecipheriv } from 'crypto';

export type Edge<T> = {
  node: T;
  cursor: string;
};
export function secretMask(cc: string, num = 4, mask = '*'): string {
  return cc.slice(-num).padStart(cc.length, mask);
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

export function encrypt(key, iv, data) {
  const decipher = createCipheriv('aes-128-cbc', key, iv);
  // decipher.setAutoPadding(true);
  return decipher.update(data, 'binary', 'base64') + decipher.final('base64');
}

export function decrypt(key, iv, crypted) {
  crypted = new Buffer(crypted, 'base64').toString('binary');
  const decipher = createDecipheriv('aes-128-cbc', key, iv);
  return decipher.update(crypted, 'binary', 'utf8') + decipher.final('utf8');
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
