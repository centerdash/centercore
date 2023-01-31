import { createHash } from 'crypto'

export default class Crypto {
    genSolo(levelString: String) {
        let hash = ''
		let x = 0
		for(let i = 0;i < levelString.length;i += parseInt((levelString.length / 40).toString())) {
			if(x > 39) break
			hash += levelString[i]
			x++
		}
		return createHash('sha1').update(hash + 'xI25fpAapCQg').digest('hex')
    }

    genSolo2(multiString: String) {
        return createHash('sha1').update(multiString + 'xI25fpAapCQg').digest('hex')
    }

	genSolo3(multiString: String) {
        return createHash('sha1').update(multiString + 'oC36fpYaPtdg').digest('hex')
    }

    genSolo4(multiString: String) {
        return createHash('sha1').update(multiString + 'pC26fpYaQCtg').digest('hex')
    }
}