import { LightningElement, track, wire } from 'lwc';
import getTeamList from '@salesforce/apex/CustomController.getTeamList';
import getAllTeamMembers from '@salesforce/apex/CustomController.getAllTeamMembers';
import insertMember from '@salesforce/apex/CustomController.insertMember';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { SEVERITY, TOAST_MODE } from "./const";

export default class TeamsApp extends LightningElement {
  @track teamMemberList = [];
  @wire(getTeamList)
  teams;

  @wire(getAllTeamMembers)
  getTeamMembers({ data, error }) {
    if (data) {
      this.teamMemberList = data;
    }
  }

  handleSubmit(event) {
    insertMember({
      name: event.detail.memberName,
      teamId: event.detail.teamId.split(":")[0],
      skills: event.detail.memberSkills
    })
      .then((res) => {
        if (res) {
          this.showSuccessToast();
          this.teamMemberList = [
            {
              Name: res.Name,
              Skills__c: res.Skills__c,
              Team__r: {
                Name: res.Team__r.Name
              }
            },
            ...this.teamMemberList
          ];
        } else {
          this.showErrorToast();
        }
      })
      .catch((err) => console.log(err));
  }
  showSuccessToast() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Successfully!",
        message: "Record inserted successfully.",
        variant: SEVERITY.success,
        mode: TOAST_MODE.dismissable
      })
    );
  }
  showErrorToast() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Failed!",
        message: "Record insertion failure.",
        variant: SEVERITY.error,
        mode: TOAST_MODE.dismissable
      })
    );
  }
}