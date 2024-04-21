import fs from 'node:fs'
import { Today } from './today'

const getTodayFromFile = function (path: string) {
  const todayString = fs.readFileSync(path, 'utf8')
  return new Today(todayString)
}

const initToday = function (): Today {
  return new Today('')
}

const writeTodayToFile = function (today: Today, path: string): [string, Today] {
  const mark = today.printMarkdown()
  fs.writeFileSync(path, mark)
  return [mark, today]
}

export { getTodayFromFile, initToday, writeTodayToFile }
