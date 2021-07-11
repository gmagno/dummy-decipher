import {Command, flags} from '@oclif/command'
import {createDecipheriv} from 'crypto'

class Decipher extends Command {
  static description = 'Yet another decipher'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    key: flags.string({char: 'k', description: 'key'}),
    data: flags.string({char: 'd', description: 'encrypted data'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Decipher)

    const key = flags.key
    const data = flags.data

    if (key && data) {
      const decryptedData = this.decipherData(data, key)
      this.log(decryptedData)
    } else {
      this.log('-k or -d flags are missing...')
    }
  }

  decipherData(encryptedText: string, key: string): string {
    const decipher = createDecipheriv(
      'aes-256-cbc',
      key,
      Buffer.alloc(16, 0)
    )
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}

export = Decipher
