import React, { Component } from "react"
import { xlsxData } from "./datas"
import XLSX from "xlsx"

import styles from "./styles.module.less"

class Home extends Component {
  state = {
    type: 0,
    style: "base", //base本地已转化数据，up上传的文件
    sheetList: []
  }
  componentDidMount() {
    // this.init()
  }
  /**
   * @name init
   * @description 初始化表格数据
   */
  init = () => {
    const { type } = this.state
    let workbook = xlsxData()

    let sheetList = []
    let persons = []
    // 遍历每张表读取
    for (let sheet in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheet)) {
        sheetList.push(sheet)
      }
    }
    this.setState({ sheetList })
    persons = XLSX.utils.sheet_to_html(workbook.Sheets[sheetList[type]])

    document.getElementById("demo").innerHTML = persons
  }
  /**
   * @name typeChange
   * @param type number 下标
   * @description 点击切换 需要本地数据支持
   */
  typeChange = type => {
    const { style } = this.state
    this.setState({ type }, () => {
      if (style === "base") {
        this.init()
      }
    })
  }
  xlsx

  /**
  @name files

  FileReader共有4种读取方法：
  1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
  2.readAsBinaryString(file)：将文件读取为二进制字符串
  3.readAsDataURL(file)：将文件读取为Data URL
  4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
  XLSX.utils.sheet_to_csv：生成CSV格式
  XLSX.utils.sheet_to_txt：生成纯文本格式
  XLSX.utils.sheet_to_html：生成HTML格式
  XLSX.utils.sheet_to_json：输出JSON格式
  */

  files = e => {
    console.log("files===", e)
    if (!e) {
      return
    }

    let rABS = false //是否将文件读取为二进制字符串
    let that = this
    let workbook = "" //读取完成的数据
    let persons = []
    let files = e && e.target.files
    // let f = Object.files[0];
    let f = files[0]
    let sheetList = []
    let fileReader = new FileReader()
    fileReader.onload = function(e) {
      try {
        let data = e.target.result
        if (rABS) {
          workbook = XLSX.read(btoa(that.fixdata(data)), {
            //手动转化
            type: "base64"
          })
        } else {
          workbook = XLSX.read(data, {
            type: "binary"
          })
        }
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        //此处打印workbook,可以复制控制台workbook，存进data.js,以此来进行初始化渲染
        console.log("二进制流方式===", JSON.stringify(workbook), persons)
      } catch (e) {
        console.log("文件类型不正确")
        return
      }
      // 表格的表格范围，可用于判断表头是否数量是否正确
      let fromTo = ""
      // 遍历每张表读取
      for (let sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          // fromTo = workbook.Sheets[sheet]["!ref"] //判断表头的数量，就需要使用到!ref属性
          sheetList.push(sheet)
          //此处persons为整个Exel表格
          // persons = persons.concat(XLSX.utils.sheet_to_html(workbook.Sheets[sheet]))
          // break // 如果只取第一张表，就取消注释这行
        }
      }
      console.log("sheetList===", sheetList, fromTo)
      //单个子表
      that.setState({ sheetList, style: "up" })
      persons = XLSX.utils.sheet_to_html(workbook.Sheets[sheetList[0]])
      document.getElementById("demo").innerHTML = persons
      document.getElementById("forms") && document.getElementById("forms").reset()
      //行数
      console.log(workbook.SheetNames.length)
    }
    if (rABS) {
      fileReader.readAsArrayBuffer(f)
    } else {
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(f)
    }
  }

  render() {
    const { sheetList = [], type } = this.state
    return (
      <div>
        <div>
          <div style={{ padding: "20px" }}>
            {sheetList instanceof Array &&
              sheetList.length > 0 &&
              sheetList.map((item, index) => (
                <div key={index} className={`${styles.type} ${index === type ? styles.type_active : null}`} onClick={() => this.typeChange(index)}>
                  {item}
                </div>
              ))}
          </div>
          <form action="" id="forms">
            <input type="file" name="xlfile" id="xlf" accept=".xlsx" onChange={this.files} />
          </form>
          <div id="demo" className={styles.demo}></div>
        </div>
      </div>
    )
  }
}

export default Home
