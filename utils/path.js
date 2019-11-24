const API_ROOT = '/api'

module.exports = {
  basePath: (path) => {
    return API_ROOT.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
  }
}
