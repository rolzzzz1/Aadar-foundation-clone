module.exports = function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(200).json({
    ok: true,
    service: "aadar-foundation-clone",
    timestamp: new Date().toISOString(),
  });
};

