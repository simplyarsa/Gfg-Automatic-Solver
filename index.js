import puppeteer from 'puppeteer';
import 'dotenv/config'
import express from 'express';
import nodemailer from 'nodemailer';
import { CronJob } from 'cron';
import { getCode } from './getcode.js';
import { compile_and_submit } from './apitest.js';

const app = express();
const port = process.env.PORT || 3000;

let page;

const main =async () => {
    // Launch the browser
    const browser = await puppeteer.launch({
        args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote",
        ],
        executablePath:
          process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
      });

    try {
        // const browser = await puppeteer.launch({ headless: false });
        // const browser = await puppeteer.launch();
        page = await browser.newPage();

        await page.goto('https://www.geeksforgeeks.org/problem-of-the-day/');
        await delay(2000);

        await page.waitForSelector("#potd_solve_prob")
        let new_url = await page.evaluate(() => document.querySelector("#potd_solve_prob").href)
        let ques = new_url.split("/")[4];

        console.log(ques)

        await page.goto(new_url);
        await delay(5000);

        let text = await page.evaluate(() => document.querySelector("#__NEXT_DATA__").innerText)

        let index = text.match(`"id"`).index;
        let pid = text.substring(index + 5, index + 11);
        console.log(pid);

        await login()

        await delay(5000);
        let Cookies = await page.cookies();
        // console.log(Cookies)
        let myCookie = "";
        Cookies.forEach((cookie) => {
            myCookie += `${cookie.name}=${cookie.value}; `
        });

        await delay(2000);
        let myCode = await getCode();
        // console.log("Mycode:", myCode)

        await compile_and_submit(myCookie, myCode, ques, pid);

        console.log("dones")
        await browser.close();
    }
    catch (error) {
        console.log(error)
    }
    finally {
        await browser.close();
    }
};


function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function login() {
    await page.waitForSelector(".problems_login_button__VhEbC")
    let but = await page.$(".problems_login_button__VhEbC")
    await but.click();
    await page.click(".problems_login_button__VhEbC")

    await delay(2000);

    await page.type(".next_input", process.env.EMAIL , { delay: 100 });
    await page.type(`input[type="password"]`, process.env.PASSWORD , { delay: 100 });
    await delay(2000);
    await page.click(".loginBtn");

    console.log("Login done")
}

const cronFunction = new CronJob("0 10 17 * * *", async () => {
    await main().catch(console.error);
});

cronFunction.start();

app.get('/', async (req, res) => {
    res.send("Hello from backend");
});

app.get("/time", (req, res) => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      const map={
        "Jan":"January",
        "Feb":"February",
        "Mar":"March",
        "Apr":"April",
        "May":"May",
        "Jun":"June",
        "Jul":"July",
        "Aug":"August",
        "Sep":"September",
        "Oct":"October",
        "Nov":"November",
        "Dec":"December"
  }
      
      let curr_date=new Date().toString()
    
    res.send(curr_date)
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});