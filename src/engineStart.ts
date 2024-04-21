import process from 'node:process'
import fs from 'node:fs'
import path from 'node:path'
import type { ReadLine } from 'node:readline'
import readline from 'node:readline'
import { getTodayFromFile, writeTodayToFile } from './today/todayFile'
import { Today } from './today/today'
import { copyToClipboard } from './systemInteraction/systemInteraction'
import { dealImg, getImgMarkdown, isImg } from './today/markdown'

const ROOT_PATH = process.argv[1].replace('engineStart.ts', '')
const today = getTodayFromFile(path.join(ROOT_PATH, '..', 'today.md'))
const args = process.argv.slice(2)
// FIXME: readline 逻辑
const rl: ReadLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

if (args.length === 0) {
  rl.question('What do you get today? ', (answer) => {
    today.description = answer === '' ? 'No description' : answer
    const todos_still = today.todos.filter(todo => !todo.includes('✅')).map(todo => todo.replace(' 🕐', ''))
    const assert_path = path.join(ROOT_PATH, '../assets/today/', `${today.getDateString()}-${today.description}.md`)
    if (fs.existsSync(assert_path)) {
      console.error('Today file already exists')
      process.exit(1)
    }
    // TODO: img 转移和命名功能
    const imgArray = getImgMarkdown(today.notes.map(note => note.content))
    try {
      const imgMarkdownArray = dealImg(imgArray)
      imgMarkdownArray.forEach((img: { img: string; img_new: string }) => {
        today.notes.forEach((note) => {
          note.content = note.content.replace(img.img, img.img_new)
        })
      })
    }
    catch (error) {
      console.error(`Error in dealing with images: ${error}`)
      return process.exit(1)
    }
    try {
      writeTodayToFile(today, assert_path)
      const newDay = new Today('')
      todos_still.forEach(todo => newDay.addTodo(todo))
      writeTodayToFile(newDay, path.join(ROOT_PATH, '..', 'today.md'))
    }
    catch (error) {
      console.error(`Error in writing today file: ${error}`)
      return process.exit(1)
    }
    try {
      const images = fs.readdirSync(path.join(process.cwd(), './assets/'))
      images.forEach((image: string) => {
        if (isImg(image) === true)
          fs.unlinkSync(path.join(process.cwd(), './assets/', image))
      })
    }
    catch (error) {
      console.error(`Error in deleting images: ${error}`)
      return process.exit(1)
    }

    rl.close()
  })
}
else if (args[0] === '--add') {
  if (args.length >= 2) {
    if (args[1] === '-goal') {
      rl.question('Goal: ', (goal) => {
        today.addGoal(goal)
        rl.close()
        writeTodayToFile(today, path.join(ROOT_PATH, '..', 'today.md'))
      })
    }
    else if (args[1] === '-todo') {
      rl.question('Todo: ', (todo) => {
        rl.question('Classify: ', (classify) => {
          rl.question('Finished(T/F): ', (finished_temp) => {
            let finished: boolean = false
            if (['true', 't', 'True', 'T', 'yes', 'y', 'Y', 'Yes'].includes(finished_temp) === true) {
              finished = true
            }
            else if (['false', 'f', 'False', 'F', 'no', 'n', 'N', 'No'].includes(finished_temp) === true) {
              finished = false
            }
            else {
              console.error('Finished must be true or false')
              process.exit(1)
            }
            if (classify === '')
              classify = '__default__'
            today.addTodo(todo, classify, finished)
            rl.close()
            writeTodayToFile(today, path.join(ROOT_PATH, '..', 'today.md'))
          })
        })
      })
    }
    else if (args[1] === '-note') {
      rl.question('Title: ', (title) => {
        rl.question('Content: ', (content) => {
          today.addNote(title, content)
          rl.close()
          writeTodayToFile(today, path.join(ROOT_PATH, '..', 'today.md'))
        })
      })
    }
    else {
      console.error('Invalid command')
      process.exit(1)
    }
  }
}
else if (args[0] === '--finish') {
  if (args.length === 1) {
    rl.question('todos number: ', (todos) => {
      let todoArray: number[] = []
      try {
        todoArray = todos.split(',').map((todo: string) => Number.parseInt(todo))
      }
      catch (e) {
        console.error('Invalid input')
        process.exit(1)
      }
      today.finishTodo(todoArray)
      writeTodayToFile(today, path.join(ROOT_PATH, '..', 'today.md'))
      rl.close()
    })
  }
  else {
    console.error('Invalid command')
    process.exit(1)
  }
}
else if (args[0] === '--worklog') {
  copyToClipboard(today.getWorkLogString())
  rl.close()
}
