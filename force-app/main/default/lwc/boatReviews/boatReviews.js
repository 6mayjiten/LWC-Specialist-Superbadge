import { NavigationMixin } from 'lightning/navigation';
import { LightningElement, api } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';

export default class BoatReviews extends NavigationMixin(LightningElement) {
    boatId;
    error = undefined;
    boatReviews = null;
    isLoading = false;
    
    @api
    get recordId() {
        return this.boatId;
    }
    
    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
        this.getReviews();
    }
    
    @api
    get reviewsToShow() {
        if(this.boatReviews &&  this.boatReviews != undefined && this.boatReviews.length>0){
            return true;
        }
        return false;
    }
    
    @api
    refresh() { 
        this.getReviews();
    }
    
    getReviews() { 
        if(this.boatId == null){
            return;
        }
        this.isLoading = true;
        getAllReviews({boatId: this.boatId})
            .then((response)=>{
                this.boatReviews = response;
            })
            .catch(error=>{
                console.log(error);
                this.error = error;
            })
            .finally(() =>{
                this.isLoading = false;
            });
    }
    
    navigateToRecord(event) { 
        event.preventDefault();
        let userId = event.target.dataset.recordId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                objectApiName: 'User',
                recordId: userId,
                actionName: 'view',
            },
        });
    }
}