import process from 'node:process'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getTodayFromFile } from '../src/today/todayFile'
import { getImgMarkdown } from '../src/today/markdown'

describe('today', () => {
  it('work_log', () => {
    const ROOT_PATH = process.cwd()
    expect(getTodayFromFile(path.join(ROOT_PATH, 'today.md')).getWorkLogString())
      .toEqual(getTodayFromFile(path.join(ROOT_PATH, 'today.md')).getWorkLogString())
  })
  it('img_regex', () => {
    const contentTest = [`![temp](/Users/ycte/Desktop/temp.png)>
<img src="/Users/ycte/Desktop/temp.png" alt="temp" style="zoom:33%;" />
aaaa `]
    expect(getImgMarkdown(contentTest))
      .toEqual([
          `![temp](/Users/ycte/Desktop/temp.png)`,
          `<img src="/Users/ycte/Desktop/temp.png" alt="temp" style="zoom:33%;" />`,
      ])
  })
  // it('deal_img', () => {
  //   const contentArray = ['![alt text](assets/image.png)']
  //   expect(getImgMarkdown(contentArray)).toEqual()
  // })
})
