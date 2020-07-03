import {MessageContext, publish} from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { NavigationMixin } from 'lightning/navigation';
import { LightningElement, wire, api, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import BOAT_OBJECT from '@salesforce/schema/Boat__c';
import NAME_FIELD from '@salesforce/schema/Boat__c.Name';
//import LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
//import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
//import DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';
const COLS = [
    { label: 'Name', fieldName: 'Name', type: 'text', editable: true },
    { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
    { label: 'Description', fieldName: 'Description__c', type: 'text', editable: true }
];

export default class BoatSearchResults extends LightningElement {
    @api selectedBoatId = '';
    @api boatTypeId = '';
    boats;
    isLoading = false;
    columns = COLS;
    @track draftValues = [];

    @wire(MessageContext) messageContext;
    @wire(getBoats, {boatTypeId: '$boatTypeId'})
    wiredBoats(result){
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boats = result;
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }
          
    @api searchBoats(boatTypeId) { 
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = boatTypeId;
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    @api async refresh() {
        return refreshApex(this.boats);  
     }

    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
    }

    sendMessageService(boatId) {
        const message = {
            recordId: boatId
        };
        publish(this.messageContext, BOATMC, message);
    }

    handleSave() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => {
            updateRecord(recordInput);
        });
        Promise.all(promises)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Ship It!',
                        variant: 'success'
                    })
                );
                this.draftValues = [];
                this.refresh();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            })
            .finally(() => {
                this.isLoading = false;
                this.notifyLoading(this.isLoading);
            });
    }

    notifyLoading(isLoading) { 
        if(isLoading){
            this.dispatchEvent(new CustomEvent('loading', {detail: isLoading}));
        }else{
            this.dispatchEvent(new CustomEvent('doneloading', {detail: isLoading}));
        }
    }
}