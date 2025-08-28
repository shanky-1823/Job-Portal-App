import { LightningElement, track, wire } from 'lwc';
import getJobOpenings from '@salesforce/apex/JobApplicationService.getJobOpenings';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import DEPARTMENT_FIELD from '@salesforce/schema/Job_Opening__c.Department__c';
import JOB_OPENING_OBJECT from '@salesforce/schema/Job_Opening__c';

export default class JobPortal extends LightningElement {
    // State variables for the UI flow
    @track view = 'list';
    @track searchTerm = '';
    @track selectedDepartment = '';
    @track selectedJobId;
    
    // Picklist options for the department filter
    @track departmentOptions;

    // Use a wire service to fetch job openings based on filters
    @wire(getJobOpenings, { searchTerm: '$searchTerm', departmentFilter: '$selectedDepartment' })
    jobs;

    // Use a wire service to get the department picklist values
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: DEPARTMENT_FIELD })
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.departmentOptions = [{ label: 'All', value: '' }, ...data.values.map(value => ({
                label: value.label,
                value: value.value
            }))];
        } else if (error) {
            console.error('Error fetching department picklist values', error);
        }
    }
    
    // Getters for conditional rendering
    get isListView() {
        return this.view === 'list';
    }

    get isDetailView() {
        return this.view === 'detail';
    }

    get isApplicationView() {
        return this.view === 'application';
    }

    // Handles search input changes
    handleSearchChange(event) {
        this.searchTerm = event.target.value;
    }
    
    // Handles department filter changes
    handleDepartmentChange(event) {
        this.selectedDepartment = event.detail.value;
    }

    // Handles the custom event from jobCard to show the job detail page
    handleJobSelect(event) {
        this.selectedJobId = event.detail.jobId;
        this.view = 'detail';
    }
    
    // Handles the custom event to go back to the job list view
    handleBackToSearch() {
        this.view = 'list';
    }
    
    // Handles the custom event to start the application form
    handleStartApplication() {
        this.view = 'application';
    }

    // Handles the custom event on successful application submission
    handleApplicationSuccess() {
        this.view = 'list'; // Go back to the list view after a successful submission
    }
}