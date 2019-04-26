import Axios from 'axios'
export function getMusicInfo() {
  return Axios.get('/api/music-info').then((res) => {
    return res.data
  })
}
