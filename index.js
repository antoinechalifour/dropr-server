require('dotenv').config()
const App = require('./src/App')

const app = App()
;(async function () {
  const port = process.env.PORT
  await app.start({ port })

  console.log(`Server running @ http://0.0.0.0:${port}`)
})()
