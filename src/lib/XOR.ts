export default class XOR {
	public text2ascii(text: string): string[] {
		return text.toString().split('').map((char: any) => char.charCodeAt(0))
	}

	public cipher(data: string, key: number): string {
		let dataAscii: any = this.text2ascii(data)
		let keyAscii: any = this.text2ascii(key.toString())
		let cipher = ''

		for (let i = 0; i < data.length; i++) {
			let char = dataAscii[i] ^ keyAscii[i % key.toString().length]
			cipher += String.fromCodePoint(char)
		}

		return cipher
	}

	public encrypt(password: string, key: number): string {
		return Buffer.from(this.cipher(password, key)).toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
	}

	public decrypt(gjp: string, key: number): string {
		return this.cipher(Buffer.from(gjp.replace(/_/g, '/').replace(/-/g, '+'), 'base64').toString(), key)
	}
}