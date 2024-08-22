function getPublicIdFromUrl(url) {
  const regex = /\/v[0-9]+\/([^\/]+)\/([^\/]+)\.[a-z]{3,4}$/;
  const match = url.match(regex);
  return match ? match[2] : null;
}
  module.exports = { getPublicIdFromUrl };