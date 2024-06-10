import puppeteer from 'puppeteer';

let page, date, month;

export const getCode= async () => {
    
    getDate()
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

    page = await browser.newPage();

    await page.goto(`https://raw.githubusercontent.com/Hunterdii/GeeksforGeeks-POTD/main/${month}%202024%20GFG%20SOLUTION/${month}-${date}.cpp`);

    let text = await page.evaluate(() => document.querySelector("pre").innerText)
    
    await browser.close();

    return text;
};


function getDate(){
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
      console.log(curr_date.split(" ")[2], map[curr_date.split(" ")[1]])
      month= map[curr_date.split(" ")[1]];
      date= curr_date.split(" ")[2];
}

