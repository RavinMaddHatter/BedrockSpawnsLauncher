const CryptoJS = require('ts.cryptojs256');

/**
 * Default options for JWT signature
 */
const defaultHeader = { alg: 'HS256', typ: 'JWT' };

/**
 * Return a base64 URL
 *
 * @param {string} data - some data to be base64 encoded
 * @return {string} A base64url encoded string
 */
function base64url (data) {
  return CryptoJS.enc.Base64
    .stringify(data)
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Create a very basic JWT signature
 *
 * @param {Object} data - the data object you want to have signed
 * @param {string} secret - secret to use to sign token with
 * @param {Object} options - JWT header options
 * @return {string} JSON Web Token that has been signed
 */
function sign (data, secret, options = {}) {
  const header = Object.assign(defaultHeader, options);
  if (header.alg !== 'HS256' && header.typ !== 'JWT') {
    throw new Error('jwt-encode only support the HS256 algorithm and the JWT type of hash');
  }

  const encodedHeader = encode(header);
  const encodedData = encode(data);

  let signature = `${encodedHeader}.${encodedData}`;
  signature = CryptoJS.HmacSHA256(signature, secret);
  signature = base64url(signature);
  return `${encodedHeader}.${encodedData}.${signature}`;
}

/**
 *  Safely base64url encode a JS Object in a way that is UTF-8 safe
 *
 *  @param {Object} Javascript object payload to be encoded
 *  @return {string} utf-8 safe base64url encoded payload
 */
function encode (data) {
  const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
  return base64url(stringifiedData);
}

module.exports = sign;
