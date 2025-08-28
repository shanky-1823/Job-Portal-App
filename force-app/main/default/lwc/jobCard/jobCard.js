import { LightningElement, api } from 'lwc';

export default class JobCard extends LightningElement {
    // Public property to receive the job record from the parent component
    @api job;
    
    /**
     * Dispatches a custom event to the parent component when the card is clicked,
     * signaling a job has been selected.
     */
    handleSelect() {
        this.dispatchEvent(new CustomEvent('selectjob', {
            detail: { jobId: this.job.Id }
        }));
    }
}