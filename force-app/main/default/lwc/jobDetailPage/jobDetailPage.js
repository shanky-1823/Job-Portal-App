import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import JOB_TITLE_FIELD from '@salesforce/schema/Job_Opening__c.Job_Title__c';
import DEPARTMENT_FIELD from '@salesforce/schema/Job_Opening__c.Department__c';
import LOCATION_FIELD from '@salesforce/schema/Job_Opening__c.Location__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Job_Opening__c.Description__c';

const FIELDS = [JOB_TITLE_FIELD, DEPARTMENT_FIELD, LOCATION_FIELD, DESCRIPTION_FIELD];

export default class JobDetailPage extends LightningElement {
    // Public property to receive the selected job Id
    @api jobId;
    
    // Wire service to get the detailed job record data
    @wire(getRecord, { recordId: '$jobId', fields: FIELDS })
    job;

    /**
     * Dispatches a custom event to go back to the list view.
     */
    handleBack() {
        this.dispatchEvent(new CustomEvent('backtosearch'));
    }
    
    /**
     * Dispatches a custom event to start the application form.
     */
    handleApply() {
        this.dispatchEvent(new CustomEvent('startapplication'));
    }
}