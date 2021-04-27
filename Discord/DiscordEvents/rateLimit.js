module.exports = async function (
  rateLimitInfo
) {
  console.log("!!!!!!!!!!!!!!!!! ALERTE !!!!!!!!!!!!!!!!!!");
  console.log("RateLimit atteint sur "+rateLimitInfo.route+" - "+rateLimitInfo.path+" avec "+rateLimitInfo.method);
  console.log("Timeout (ms) : "+ rateLimitInfo.timeout+" / Limite : "+rateLimitInfo.limit);
};
