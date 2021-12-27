import { api, LightningElement, track } from 'lwc';
import getTeamMembers from '@salesforce/apex/CustomController.getTeamMembers';
import getAllTeamMembers from '@salesforce/apex/CustomController.getAllTeamMembers';

export default class TeamsList extends LightningElement {
	@api teams;
	@track teamId = '';
	@track teamMembersList = [];
	@api
	get teammembers() {
		return this.teamMembersList;
	}
	set teammembers(value) {
		this.teamMembersList = value;
	}

	get teamList() {
		let list = [];
		list.push({ label: 'None', value: null });
		if(this.teams.data){
			this.teams.data.forEach(team => {
				list.push({ label: team.Name, value: team.Id });
			});
		}
        return list;
    }

	handleChange(event){
        this[event.target.name] = event.target.value;
		if(this.teamId == null){
			getAllTeamMembers()
			.then( data => {
				if(data){
					this.teammembers = data;
				}
			});
		}
		else{
			getTeamMembers({teamId: this.teamId})
			.then( data => {
				if(data){
					this.teammembers = data;
				}
			});
		}
    }
}