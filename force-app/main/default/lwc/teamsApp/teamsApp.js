import { LightningElement, track, wire } from 'lwc';
import getTeamList from '@salesforce/apex/CustomController.getTeamList';
import getAllTeamMembers from '@salesforce/apex/CustomController.getAllTeamMembers';
import insertMember from '@salesforce/apex/CustomController.insertMember';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TeamsApp extends LightningElement {
	@track teamMemberList = [];
	@wire(getTeamList)
	teams;

	@wire(getAllTeamMembers)
	getTeamMembers({data, error}){
		if(data){
			this.teamMemberList = data;
		}
	}

	handleSubmit(event) {
		insertMember({ name: event.detail.memberName, teamId: event.detail.teamId.split(':')[0], skills: event.detail.memberSkills })
			.then(res => {
				if(res){
					this.showSuccessToast();
					this.teamMemberList = [{
						'Name':event.detail.memberName,
						'Skills__c':event.detail.memberSkills,
						'Team__r': {
							'Name': event.detail.teamId.split(':')[1]
						}
					},
					...this.teamMemberList
					];
				}
				else
					this.showErrorToast();
			})
			.catch(err => console.log(err));
	}
	showSuccessToast() {
		this.dispatchEvent(
			new ShowToastEvent({
				title: 'Successfully!',
				message: 'Record inserted successfully.',
				variant: 'success',
				mode: 'pester'
			})
		);
	}
	showErrorToast() {
		this.dispatchEvent(
			new ShowToastEvent({
				title: 'Failed!',
				message: 'Record insertion failure.',
				variant: 'error',
				mode: 'pester'
			})
		);
	}
}