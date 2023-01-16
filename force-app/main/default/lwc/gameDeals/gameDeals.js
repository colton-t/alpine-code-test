import { LightningElement } from 'lwc';
import getTitleDeals from "@salesforce/apex/GameDealsController.getTitleDeals";
import getStores from "@salesforce/apex/GameDealsController.getStores";

const columns = [
    { type: 'button', cellAttributes: { alignment: 'center' }, typeAttributes: { label: 'View', title: 'View', name: 'view', iconPosition: 'center', variant: 'brand'}, fixedWidth: 150},
    { label: 'Title', fieldName: 'title', type: 'text', hideDefaultActions: true, sortable: "true"},
    { label: 'Deal Rating', fieldName: 'dealRating', type: 'number', hideDefaultActions: true, initialWidth: 200,
        typeAttributes: {minimumIntegerSignificantDigits: '1',},
        cellAttributes: { class: {fieldName: 'dealColor'}, alignment: 'center' }, sortable: "true"},
    { label: 'Normal Price', fieldName: 'normalPrice', type: 'currency', hideDefaultActions: true, 
        cellAttributes: { alignment: 'left' }, sortable: "true" },
    { label: 'Sale Price', fieldName: 'salePrice', type: 'currency', hideDefaultActions: true, 
        cellAttributes: { alignment: 'left' }, sortable: "true" },
    { label: 'Reviews', fieldName: 'steamRatingText', type: 'text', hideDefaultActions: true,  },
];
export default class PcGameDeals extends LightningElement {
    sortBy;
    sortDirection
    columns = columns;
    games;
    stores = {};
    filters = {};
    selectedGame;
    selectedStore;
    dealLink;
    storeIcon;
    showModal = false;


    connectedCallback() {
        getStores().then( response => {
            this.stores = response;
        }).catch(error => {
            console.error(error);
        })
    }

    fetchGameDeals() {
        let searchTitle = this.filters.titleInput;

        getTitleDeals({ searchTitle }).then( response => {

            // Get data and add new color coded field for datatable based on rating
            this.games = response.map((item) => {
                let dealColor = item.dealRating > 5 ? 'slds-text-color_success': 'slds-text-color_error';
                return {...item,
                    'dealColor' : dealColor
                }
            }); 
        }).catch(error => {
            console.error(error);
        })
    }

    handleRowAction(event) {
        // Handles the view button press on data table
        if(event.detail.action.name === 'view') {
            this.selectedGame = event.detail.row;
            this.selectedStore = this.stores.find(x => x.storeID === this.selectedGame.storeID);
            this.dealLink = "https://www.cheapshark.com/redirect?dealID=" + this.selectedGame.dealID;
            this.storeIcon = "https://www.cheapshark.com/" + this.selectedStore.images.icon;

            this.showModal = true;
        }
    }

    handleCloseModal(event) {
        this.showModal = false;
    }

    handleInputChange(event) {
        this.filters = { titleInput: event.target.value }
    }

    handleSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.games));
        
        let keyValue = (a) => {
            return a[fieldname];
        };
        
        let isReverse = direction === 'asc' ? 1: -1;

        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';

            if (fieldname == "title")
                return isReverse * ((x > y) - (y > x));
            else
                return isReverse * (parseFloat(x) > parseFloat(y)) - (parseFloat(y) > parseFloat(x));
        });
        
        this.games = parseData;
    }    
}