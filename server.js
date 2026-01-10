const app = require("./app");

// set port, listen for requests
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});
