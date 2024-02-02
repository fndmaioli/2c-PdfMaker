import * as fs from 'fs';
import { Client } from '../utils/interfaces'
import Papa from 'papaparse';
import os from 'node:os'
import { runAppleScript } from 'run-applescript';
import { dialog } from 'electron';

export async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
      // export to csv
      const filePath = filePaths[0]
      const fileType = filePath.split(".").pop()
      if (fileType === "csv") {
        const jsonData = await csvReader(filePath)
        return jsonData
      }
      const fileName = filePath.split("/").pop()?.replace(".numbers", "")
      await runAppleScript(`
    tell application "Finder" to set myFolder to path to desktop
    tell application "Numbers"
      launch
      open "` + filePath + `"
      set aDoc to front document
      set docName to aDoc's name as text
      set exportName to (myFolder as text) & docName
      set exportName to exportName's text 1 thru -8
      --set exportName to (exportName & "csv")
      export front document to file exportName as CSV
      close aDoc
    end tell`)
      const homeDir = os.homedir();
      const csvPath = `${homeDir}/Desktop/` + fileName + `./2C Work-2C WORK.csv`
      const jsonData = await csvReader(csvPath)
      deleteFolder(`${homeDir}/Desktop/` + fileName + `.`)
      return jsonData
    } else {
      return false
    }
}

async function csvReader(path: string) {
  return new Promise((resolve, reject) => {
    const data: string[] = []
    fs.createReadStream(path)
      .pipe(Papa.parse(Papa.NODE_STREAM_INPUT))
      .on('error', error => {
        console.error(error)
        reject(error)
      })
      .on('data', row => data.push(row))
      .on('end', () => { resolve(formatToJSON(data)) });
  });
}

function formatToJSON(data: string[]) {
  const json: Client[] = []
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0].length !== 0) {
      json.push({
        name: row[0].trim(),
        posts: []
      })
    } else {
      json[json.length-1].posts.push({
        name: row[1],
        content: row[3],
        date: row[4].trim(),
        comments: row[8]
      })
    }
  }
  return json
}

async function deleteFolder(path: string) {
  fs.rm(path, { recursive: true }, () => {})
}