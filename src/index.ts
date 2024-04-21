import { calculateAge } from './utils'

interface character {
  name: string
  age: number
  gender: string
  skills: string[]
  height: number
  配偶?: string
}

// data source
const introduction = 'JavaScript is the most powerful programming language in the World!'
const 珊瑚宫心海: character = {
  name: '珊瑚宫心海',
  age: calculateAge('2002-05-09'),
  gender: 'female',
  skills: ['帮帮忙', '沧海之约', '深海的加护'],
  height: 158,
  配偶: 'ycte',
}
const ycte: character = {
  name: 'ycte',
  age: calculateAge('2002-02-09'),
  gender: 'male',
  skills: ['', ''],
  height: 170,
  配偶: '珊瑚宫心海',
}
const characters: character[] = []
characters.push(珊瑚宫心海, ycte)

// find husband and wife
for (let toMatch: number = 0; toMatch < characters.length; toMatch++) {
  for (let toCheck: number = toMatch; toCheck < characters.length; toCheck++) {
    const match = characters[toMatch]
    const check = characters[toCheck]
    if (match.配偶 === check.name && check.配偶 === match.name)
      // eslint-disable-next-line no-console
      console.log(`${introduction}\n${match.name} and ${check.name} are already married.`)
  }
}
