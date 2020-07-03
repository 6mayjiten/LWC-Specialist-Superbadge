import { LightningElement, api, track } from 'lwc';

export default class BoatTile extends LightningElement {
    @api boat;
    @api selectedBoatId;

    get backgroundStyle() { 
        return `background-image:url(${this.boat.Picture__c})`;
    }

    get tileClass() {
        const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
        const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';
        if(this.selectedBoatId == this.boat.Id){
            return TILE_WRAPPER_SELECTED_CLASS;
        }
        return TILE_WRAPPER_UNSELECTED_CLASS;
    }

    selectBoat(event){
        this.dispatchEvent(new CustomEvent('boatselect', {detail:{boatId: this.boat.Id}}));
    }
}