import pdfDocument from 'pdfkit'
import * as fs from 'fs';
import os from 'node:os'
import path from 'node:path'
import { Client, Post } from '../utils/interfaces';

export async function handleMakePDF(client: Client) {
    const homeDir = os.homedir();
    const pdfPath = path.join(homeDir, 'Desktop', client.name + '.pdf')
    await makePDF(pdfPath, client)
    return "pdf has been made successfully"
}

async function makePDF(path: string, client: Client) {
    const dirname = `${__dirname}/../../`
    const arabicRegular = `${dirname}/src/public/Montserrat-Arabic Regular 400.otf`
    const arabicSemiBold = `${dirname}/src/public/Montserrat-Arabic SemiBold 600.otf`
    const arabicBold = `${dirname}/src/public/Montserrat-Arabic Bold 700.otf`
    const monthStr = calculateMonth(client.posts)
    
    const doc = new pdfDocument({
        font: arabicRegular,
        size: [1025, 768]
    })
    doc.pipe(fs.createWriteStream(path))

    doc.lineWidth(25);
    doc.lineJoin('miter')
        .rect(0, 0, 1025, 768)
        .fillAndStroke([13,13,13]);
    
    doc.fillColor([129, 0, 219])
        .font(arabicBold)
        .fontSize(28)
        .text("EMPRESA", 77, 77)
        .font(arabicRegular)
        .fillColor('white')
        .text(client.name)

    doc.fillColor([129, 0, 219])
        .font(arabicBold)
        .fontSize(28)
        .text("MÊS", 300, 77, { align: 'right'})
        .font(arabicRegular)
        .fillColor('white')
        .text(monthStr, { align: 'right'})

    doc.image(`${dirname}/src/public/bottomLeft-asset.png`, -100, 560, { width: 450 })
    doc.image(`${dirname}/src/public/calendarioConteudo.png`, 77, 220, {align: 'center', valign: 'center', width: 900})
    doc.image(`${dirname}/src/public/logo.png`, 837, 595, {width: 150})

    const newPostsPage = () => {
        doc.addPage({ size: [1025, 768], margins: {top: 72, right: 72, left: 0, bottom: 0 }})
        doc.lineWidth(25);
        doc.lineJoin('miter')
            .rect(0, 0, 1025, 100)
            .fillAndStroke([13,13,13]);

        doc.image(`${dirname}/src/public/globe-asset.png`, 412, -50, { width: 100 })
        doc.image(`${dirname}/src/public/star-asset.png`, 975, 85, { width: 75 })

        doc.fillColor([129, 0, 219])
            .font(arabicSemiBold)
            .fontSize(27)
            .text("post", 50, 36)
            .text("conteúdo", 217, 36)
            .text("postagem", 577, 36)
            .text("observações", 783, 36)
        
        doc.lineJoin('miter')
            .rect(0, 701, 1025, 67)
            .fillAndStroke([13,13,13]);

        doc.fillColor([129, 0, 219])
            .font(arabicBold)
            .fontSize(15)
            .text("EMPRESA", 50, 714)
            .font(arabicRegular)
            .fillColor('white')
            .text(client.name)

        doc.fillColor([129, 0, 219])
            .font(arabicBold)
            .fontSize(15)
            .text("MÊS", 300, 714, { align: 'right'})
            .font(arabicRegular)
            .fillColor('white')
            .text(monthStr, { align: 'right'})
        
        doc.font(arabicSemiBold)
            .fillColor('black')
    }
    newPostsPage()
    
    let baseline = 150
    const newLineDist = 50
    let lineIndex = 0
    client.posts.forEach((post) => {
        const nameLines = Math.floor(doc.widthOfString(post.name)/120)
        const contentLines = Math.floor(doc.widthOfString(post.content)/350)
        const commentsLines = Math.floor(doc.widthOfString(post.comments)/200)
        let lines = (nameLines > contentLines) ? nameLines : contentLines
        lines = (lines > commentsLines) ? lines : commentsLines

        if ( lines*25 + baseline + lineIndex*newLineDist > 650 ) {
            newPostsPage()
            baseline = 150
            lineIndex = 0
        }

        doc.fontSize(20)
            .text(post.name, 55, baseline + (lineIndex*newLineDist), { width: 120})
            .fontSize(17)
            .text(post.content, 220, baseline + (lineIndex*newLineDist), { width: 350})
            .fontSize(20)
            .text(post.date, 620, baseline + (lineIndex*newLineDist), { width: 80, align: 'center' })
            .fontSize(17)
            .text(post.comments, 785, baseline + (lineIndex*newLineDist), { width: 200 })
        baseline += lines * 25
        lineIndex += 1
    });
        
    doc.end()
}

function calculateMonth(posts: Array<Post>): string {
    const monthsCount = new Map<number, number>()
    posts.forEach(post => {
        if (post.date !== undefined && post.date !== "") {
            const month = +post.date.split("/")[1]
            const count = monthsCount.get(month)
            if (count === undefined) {
                monthsCount.set(month, 1)
            } else {
                monthsCount.set(month, count+1)
            }
        }
    });

    let mostPostsNum = 0
    let mostPostsMonth = 0
    monthsCount.forEach((value: number, key: number) => {
        if (value >= mostPostsNum) {
            mostPostsMonth = key
            mostPostsNum = value
        }
    });

    switch (mostPostsMonth) {
        case 1:
            return "Janeiro"
            break;
        case 2:
            return "Fevereiro"
            break;
        case 3:
            return "Março"
            break;
        case 4:
            return "Abril"
            break;
        case 5:
            return "Maio"
            break;
        case 6:
            return "Junho"
            break;
        case 7:
            return "Julho"
            break;
        case 8:
            return "Agosto"
            break;
        case 9:
            return "Setembro"
            break;
        case 10:
            return "Outubro"
            break;
        case 11:
            return "Novembro"
            break;
        case 12:
            return "Dezembro"
            break;
        default:
            return ""
            break;
    }
}