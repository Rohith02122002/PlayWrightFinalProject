import  {saveOutputToJson} from "../Utils/SimpleJson"
import fs from "fs";

export class HondaPage{
    constructor(page){
        this.page=page;
        this.upcomingBikes=this.page.locator("//li[@class='upcoming-bike-tab']");
        this.allUpcomingBikes=this.page.getByTitle("All Upcoming Bikes");
        this.hondaFilter=this.page.locator("//a[normalize-space()='Honda']");
        this.bikeNames=this.page.locator("//div[@class='p-15 pt-10 mke-ryt rel']//a");
        this.bikeRates=this.page.locator('.b fnt-15');
        this.bikeExpectedDate=this.page.locator("//div[@class='clr-try fnt-14']")
    }
    async navigateToUrl(url){
        // await this.page.goto(url,{waituntil:'domcontentload'});
        await this.page.goto(url);    
    }
    async upcomingBikesFilter(){
        await this.upcomingBikes.scrollIntoViewIfNeeded()
        await this.upcomingBikes.click();
        await this.page.waitForTimeout(2000)
        await this.allUpcomingBikes.click();
        await this.hondaFilter.click();
    }

    async bikeData() {
        const allbikecards = await this.page.locator("#modelList li.modelItem");
        const allBikes = [];
        const selectedBikes = [];
            
          for (let i = 0; i < await allbikecards.count(); i++) {
            const price = await allbikecards.nth(i).getAttribute("data-price");
            const bikeName = await allbikecards.nth(i).locator("[data-track-label='model-name']").innerText();
            const dateExpected = await allbikecards.nth(i).locator(".clr-try.fnt-14").innerText();
        
            const bikeDetails = {
              BikeName: bikeName,
              BikePrice: price,
              BikeExpectedDate: dateExpected
            };
              allBikes.push(bikeDetails); // All bikes
        
              if (price !== null && price < 400000) {
                selectedBikes.push(bikeDetails); // Filtered
              }
          }
      
          const combinedJson = {
            allBikes,
            selectedBikes
          };  
          fs.writeFileSync("Utils/output.json",JSON.stringify(combinedJson,null,2));
          // saveOutputToJson(combinedJson);
    }
}