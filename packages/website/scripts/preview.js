const http = require('http')
const fs = require('fs')
const path = require('path')

const config = {
  port: 8000,
  baseContent: '../dist',
  indexFile: 'index.html'
}

const contentTypes = {
  '.svg': 'image/svg+xml'
}

const serverHandle = (req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(404, 'not found')
    res.end('this is static server')
    return
  }
  const url = req.url === '/' ? config.indexFile : req.url

    if (url.includes('..')) {
        res.writeHead(403); res.end('request is blocked'); return;
    }
  const urlInfo = path.parse(url)

  const filePath = path.join(__dirname, config.baseContent, url)

  fs.readFile(filePath, 'binary', (err, file) => {
    if (err) {
      res.writeHead(404, 'not found')
      res.end('<h1>404 NOT FOUND</h1>')
    } else {
      if (contentTypes[urlInfo.ext])
        res.setHeader('Content-Type', contentTypes[urlInfo.ext])
      res.write(file, 'binary')
      res.end()
    }
  })
}
http.createServer(serverHandle).listen(config.port)
console.log(`link http://localhost:${config.port}`)
