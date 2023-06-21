
const server = function (app) {
     app.listen(process.env.PORT, function () {
          console.log('Express app running on port ' + (process.env.PORT))
     });
}

module.exports = server
