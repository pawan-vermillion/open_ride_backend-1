module.exports = (error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        
       
        return res.status(400).json({ message: 'Invalid JSON format' });
      }
    
      if (error.statusCode && error.statusCode !== 500) {
        
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
  };