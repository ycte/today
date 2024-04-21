// import fs from 'node:fs'

interface notesObject {
  title: string
  content: string
}

export class Today {
  description: string = 'Today is a great day!'
  date: Date = new Date('2024-01-01')
  goals: string[] = []
  todos: string[] = []
  notes: notesObject[] = []

  constructor(todayMarkString: string | undefined, description: string = 'Today is a great day!', date: Date = new Date(), goals: string[] = [], todos: string[] = [], notes: notesObject[] = []) {
    // eslint-disable-next-line no-console
    console.log('Today is a great day!')
    if (todayMarkString === '' || todayMarkString === undefined || todayMarkString === null) {
      this.description = description
      this.date = date
      this.goals = goals
      this.todos = todos
      this.notes = notes
    }
    else {
      this._init(todayMarkString)
    }
  }

  _init(todayMarkString: string) {
    const todayMarkArray = todayMarkString.split(/\n## /g)
    let [titlePart, goalsPart, TodosPart, notesPart] = todayMarkArray.length === 4
      ? todayMarkArray
      : [...todayMarkArray, '']
    titlePart = titlePart.replace('# Today', '').replace(/\n/g, '').replace(/\r/g, '')
    const [descriptionString, dateString] = titlePart.split('> **Date**: ')
    this.description = descriptionString
    this.date = new Date(dateString)
    this.goals = this._divideIntoList(goalsPart, ['Goals', /\n/g, /\r/g], '* ')
    this.todos = this._divideIntoList(TodosPart, ['Todos', /\n/g, /\r/g], /\d+\. /g)
    // 大体思路：分割 notesPart 中的每个三级标题 => 分割标题和段落 => 过滤空标题和空段落
    this.notes = this._divideIntoList(notesPart, ['Notes', /\r/g], '### ').map((note) => {
      const noteArray: string[] = note.split(/\n/g)
      const [title, content] = [noteArray[0], noteArray.slice(1).filter(item => item !== '')
        .join('\r\n\r\n')]
      return { title, content }
    }).filter(note => !(note.title === '' && note.content === ''))
  }

  _divideIntoList(string: string, uselessWord: (RegExp | string)[] = [/\n/g, /\r/g], separator: (string | RegExp)): string[] {
    for (const sep of uselessWord)
      string = string.replace(sep, '')
    return string.split(separator).filter(item => item !== '')
  }

  _formatDate(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // getMonth() 返回的月份从 0 开始
    const day = date.getDate()
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
  }

  preview() {
    // eslint-disable-next-line no-console
    console.log('Today is a great day!')
    // eslint-disable-next-line no-console
    console.log(this.description)
    // eslint-disable-next-line no-console
    console.log(this._formatDate(this.date))
    // eslint-disable-next-line no-console
    console.log(this.goals)
    // eslint-disable-next-line no-console
    console.log(this.todos)
    // eslint-disable-next-line no-console
    console.log(this.notes)
  }

  printMarkdown() {
    return `# Today`
      + `\r\n\r\n${this.description}`
      + `\r\n\r\n> **Date**: ${this._formatDate(this.date)}`
      + `\r\n\r\n## Goals${this.goals.length === 0 ? '' : '\r\n\r\n'}${this.goals.map(goal => `* ${goal}`).join('\r\n')}`
      + `\r\n\r\n## Todos${this.todos.length === 0 ? '' : '\r\n\r\n'}${this.todos.map((todo, index) => `${index + 1}. ${todo}`).join('\r\n')}`
      + `\r\n\r\n## Notes${this.notes.length === 0 ? '' : '\r\n\r\n'}${this.notes.map(note => `### ${note.title}\r\n\r\n${note.content}`).join('\r\n\r\n')}`
      + `\r\n`
  }

  getDateString(): string {
    return this._formatDate(this.date)
  }

  // FIXME: 提取成类
  addGoal(goal: string) {
    this.goals.push(goal)
  }

  addTodo(todo: string, classify: string = '__default__', finished: boolean = false) {
    this.todos.push(`${classify === '__default__' ? '' : `【${classify}】`}${todo} ${finished ? '✅' : '🕐'}`)
  }

  finishTodo(todos: number[] | number) {
    // TODO
    if (typeof todos === 'number') {
      this._changeTodoState(todos, true)
      // this.todos[todos - 1] = this.todos[todos - 1].replace('🕐', '✅')
    }
    else {
      for (const todo of todos)
        this._changeTodoState(todo, true)
      // this.todos[todo - 1] = this.todos[todo - 1].replace('🕐', '✅')
    }
  }

  getWorkLogString() {
    const todos_temp: string[] = this.todos.filter((todo) => {
      return todo.includes('✅') && !(/【self/.test(todo))
    })
    return `${this.todos.length === 0
? ''
: ''}${todos_temp.map((todo, index) => `${index + 1}. ${todo.replace(/✅/g, '').replace(/【.*】/g, '')}`).join('\r\n')}`
  }

  _changeTodoState(todo: number, finished: boolean) {
    if (this.todos[todo - 1].includes('✅') || this.todos[todo - 1].includes('🕐'))
      this.todos[todo - 1] = this.todos[todo - 1].replace(finished ? '🕐' : '✅', finished ? '✅' : '🕐')
    else
      this.todos[todo - 1] = this.todos[todo - 1] + (finished ? '✅' : '🕐')
  }

  changeTodoClassify(todo: number, classify: string) {
    this.todos[todo - 1] = this.todos[todo - 1].replace(/【.*】/, `【${classify}】`)
  }

  removeTodo(todos: number[] | number) {
    if (typeof todos === 'number') {
      this.todos.splice(todos - 1, 1)
    }
    else {
      for (const todo of todos)
        this.todos.splice(todo - 1, 1)
    }
  }

  addNote(title: string, content: string) {
    this.notes.push({ title, content })
  }
}

// const testTodayString = fs.readFileSync('./today.md', 'utf8')

// const todayTool = new Today(testTodayString)
// todayTool.addGoal('test goal')
// todayTool.addTodo('test todo', 'test classify', false)
// todayTool.finishTodo(1)
// todayTool.addNote('test note', 'test content')
// todayTool.preview()
// console.log(todayTool.printMarkdown())
