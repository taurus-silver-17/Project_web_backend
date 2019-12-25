import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'

export class LevelDB {
  static open(path: string) {
    leveldown(path, {}, function (err, db) {
      if (err) console.log(err)
      
      return levelup(db)
    })
  }
}