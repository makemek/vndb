function execute(message) {
  return new Promise((resolve, reject) => {
    this.queueRequest(message, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

module.exports = execute;
