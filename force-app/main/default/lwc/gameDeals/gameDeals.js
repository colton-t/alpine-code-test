import { LightningElement } from 'lwc';
import getGameDeals from "@salesforce/apex/GameDealsController.getGameDeals";

const columns = [
    { label: 'Store', fieldName: 'storeID', type: 'text'},
    { label: 'Title', fieldName: 'title', type: 'text' },
    { label: 'Deal Rating', fieldName: 'dealRating', type: 'percent', 
        typeAttributes: {maximumFractionDigits: '2',},},
    { label: 'Normal Price', fieldName: 'normalPrice', type: 'currency' },
    { label: 'Sale Price', fieldName: 'salePrice', type: 'currency' },
    { label: 'Savings', fieldName: 'savings', type: 'percent' },
    { label: 'Reviews', fieldName: 'steamRatingText', type: 'text' },
];
export default class PcGameDeals extends LightningElement {
    games = {};
    columns = columns;
    filters = {};

    async fetchGameDeals() {
        console.log("Button Click");
        let criteria = await this.formatApiCriteria();
        console.log("criteria: " + criteria);
        getGameDeals({ criteria }).then( response => {
            console.log("response: " + response);
            this.games = response;
            console.log("games: " + this.games);
        }).catch(error => {
            console.error(error);
        })
    }

    async formatApiCriteria() {
        let criteria = "";
        this.filters = { titleSearch: this.template.querySelector(".search-bar").value};
        if (this.filters.titleSearch)
            criteria += "&title=" + this.filters.titleSearch;
        return criteria;
    }
}