import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

function getImgMarkdown(contentArray: string[]): string[] {
  const imgMarkdown: string[] = []
  contentArray.forEach((content: string) => {
    // const regexMarkdown = /!\[.*?\]\((.*?)\)/g
    const regexAll = /!\[.*?\]\((.*?)\)|<img\s[^>]*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/g
    // const match = regexMarkdown.exec(content)
    const matchAll = Array.from(content.matchAll(regexAll)).map(match => match[0])
    if (matchAll) {
      matchAll.forEach((img: string) => {
        if (img !== null)
          imgMarkdown.push(img)
      })
    }
  })
  return imgMarkdown
}

// TODO: 对 markdown 文件中可以引入的所有文件进行处理
// function isImg(image: string) {
//   return (
//     image.endsWith('.png') || image.endsWith('.jpg') || image.endsWith('.jpeg') || image.endsWith('.gif')
//     || image.endsWith('.webp') || image.endsWith('.svg') || image.endsWith('.bmp')
//   )
// }

function isImg(image: string) {
  return /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(image)
}

function dealImg(contentArray: string[]) {
  // TODO: 1. 遍历 `asserts` 文件夹，找到所有图片文件
  interface Img {
    originPath: string
    name: string
    currentPath: string
  }
  const imgArray: Img[] = []
  const images = fs.readdirSync(path.join(process.cwd(), './assets/'))
  images.forEach((image: string) => {
    if (isImg(image)) {
      const imageName: string = `${new Date().toISOString().replace(/:/g, '_col_')}-${image}`
      const currPath = path.join('assets/today/assets', imageName)
      imgArray.push({
        originPath: path.join('assets/', image),
        name: currPath.replace('assets/today/', ''),
        currentPath: path.join(process.cwd(), currPath),
      })
    }
  })
  // TODO: 2. 找到所有图片链接对应的新图片链接
  interface imgMarkdown {
    img: string
    img_new: string
  }
  const imgMarkdownArray: imgMarkdown[] = []
  getImgMarkdown(contentArray).forEach((img: string) => {
    imgArray.forEach((imgObj: Img) => {
      if (img.includes(imgObj.originPath))
        imgMarkdownArray.push({ img, img_new: img.replace(new RegExp(imgObj.originPath, 'g'), imgObj.name) })
    })
  })
  // console.log(imgMarkdownArray)
  // console.log(imgArray)
  // TODO: 3. 将图片文件复制到 `assets` 文件夹，并重命名
  imgArray.forEach((img: Img) => {
    const newDir = img.currentPath.replace(img.originPath.replace('assets/', ''), '')
    if (!fs.existsSync(newDir))
      fs.mkdirSync(newDir, { recursive: true })
    fs.copyFileSync(path.join(process.cwd(), img.originPath), img.currentPath)
  })
  return imgMarkdownArray
}
// const contentArray = ['![alt text](assets/image.png)']
// dealImg(contentArray)
// let contentTest = [`![temp](/Users/ycte/Desktop/temp.png)>`]
// contentTest = [`![temp](/Users/ycte/Desktop/temp.png)>
// <img src="/Users/ycte/Desktop/temp.png" alt="temp" style="zoom:33%;" />
// <img src="/Users/ycte/Desktop/temp.png" alt="temp" style="zoom:25%;" /> `]

// getImgMarkdown(contentTest)
export { getImgMarkdown, dealImg, isImg }
