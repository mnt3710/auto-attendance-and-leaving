function doPost(e) {
  //今のとこkeyの値を変えるようにしてる(s->出勤,t->退勤)
  //あとからslackと連携
  const key = "s"
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheets()[0]

  let d = new Date()
  let nowYear = d.getFullYear()
  let nowMonth = d.getMonth()
  let nowDate = d.getDate()
  //なんで10多いんだろ -> gasの標準時間
  let nowHours = d.getHours()
  let nowMinutes = d.getMinutes()

  var date =
    (nowYear + "/" + ("0" + nowMonth + 1)).slice(-2) +
    "/" +
    ("0" + nowDate).slice(-2)
  var time = ("0" + nowHours).slice(-2) + "::" + ("0" + nowMinutes).slice(-2)
  let totalMinute = nowHours * 60 + nowMinutes
  const ps = PropertiesService.getScriptProperties()
  let i: number = ps.getProperty("count")
  let amount: number = ps.getProperty("amount")

  switch (key) {
    case "reset":
      reset()
      break
    case "s":
      //ps.getPropertyはstringしか持てない？？
      if (ps.getProperty("isAttendance") == "false") {
        sheet.getRange(i, 1).setValue(nowDate)
        ps.setProperty("startTotalMinute", totalMinute)
        sheet.getRange(i, 2).setValue(time)
        ps.setProperty("isAttendance", true)
        break
      } else {
        console.error("isAttendanceがtrueになっています")
        console.log(ps.getProperty("isAttendance"))
        break
      }

    case "t":
      if (ps.getProperty("isAttendance") == "true") {
        let startTime = Number(ps.getProperty("startTotalMinute"))
        let subTime = totalMinute - startTime
        console.log(subTime)
        let allSubTime = subTime + amount
        console.log("allSubTime" + subTime)
        let jobTime = (allSubTime / 30) | 0
        let amountTime = allSubTime % 30
        console.log(amountTime)

        sheet.getRange(i, 3).setValue(time)
        sheet.getRange(i, 5).setValue(jobTime * 0.5)
        sheet.getRange(i, 6).setValue(amountTime)
        ps.setProperty("amount", amountTime)
        ps.setProperty("count", i + 1)
        ps.setProperty("isAttendance", false)
        break
      } else {
        console.log(
          "isAttendanceがfalseになっています" + ps.getProperty("isAttendance")
        )
        break
      }
  }
  return
}

const reset = () => {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheets()[0]
  const ps = PropertiesService.getScriptProperties()
  ps.setProperty("count", 2)
  ps.setProperty("isAttendance", false)
  ps.setProperty("amount", 0)
  sheet.deleteRows(2, 10)
}

const attendanceWork = () => {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheets()[0]
  const ps = PropertiesService.getScriptProperties()
}

const changeHour = (time) => {
  return ((time / 60) | 0) + ":" + ("0" + (time % 60)).slice(-2)
}

/*22:32:36	情報	amount : 1
22:32:36	情報	6
22:32:36	情報	36
22:32:36	情報	flag : false
22:32:36	情報	count : 15
*/
