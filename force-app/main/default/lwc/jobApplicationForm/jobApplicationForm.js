import { LightningElement, api, track } from 'lwc';
import createApplication from '@salesforce/apex/JobApplicationService.createApplication';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class JobApplicationForm extends LightningElement {
    @api jobId;
    @track applicant = {};
    @track isSubmitting = false;
    
    // Handles changes to the form inputs
    handleInputChange(event) {
        const { name, value } = event.target;
        this.applicant[name] = value;
    }
    
    // Placeholder for file upload handling. We will use the existing Apex service.
    handleUploadFinished(event) {
        // This is a placeholder for file upload logic. The actual file upload
        // is handled by the platform, and the ContentVersion records are
        // created automatically. We just need to make sure they are linked
        // to the correct application record via automation.
        const uploadedFile = event.detail.files[0];
        const toastEvent = new ShowToastEvent({
            title: 'File Uploaded',
            message: `${uploadedFile.name} uploaded successfully!`,
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }
    
    // Handles form submission
    handleSubmit() {
        this.isSubmitting = true;
        
        // Call the Apex method to create the Contact and Application
        createApplication({
            applicationData: this.applicant,
            jobId: this.jobId
        })
        .then(result => {
            // Success toast message
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!',
                    message: 'Your application has been submitted.',
                    variant: 'success'
                })
            );
            
            // Dispatch event to the parent to signal success
            this.dispatchEvent(new CustomEvent('success'));
        })
        .catch(error => {
            console.error('Error submitting application:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
        .finally(() => {
            this.isSubmitting = false;
        });
    }
    
    // Handles the cancel button to go back to the job details page
    handleCancel() {
        this.dispatchEvent(new CustomEvent('backtodetails'));
    }
}