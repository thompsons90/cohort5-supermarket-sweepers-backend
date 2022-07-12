exports.testApiConnection = (req, res) => {
  res.status(200).json({ message: 'api up and running' });
};
