import { api, LightningElement, track } from 'lwc';

export default class MemberSkills extends LightningElement {
	@api teams;
	@track teamId = '';
	@track memberName = '';
	@track memberSkills = '';

    get teamList() {
		let list = [];
		if(this.teams.data){
			this.teams.data.forEach(team => {
				list.push({ label: team.Name, value: team.Id+':'+team.Name });
			});
		}
        return list;
    }

	handleChange(event){
        this[event.target.name] = event.target.value;
    }
	handleSubmit(event) {
		this.dispatchEvent(new CustomEvent('insert', {
			detail : {
				memberName: this.memberName,
				teamId: this.teamId,
				memberSkills: this.memberSkills
			  }
		}));
		this.teamId = '';
		this.memberName = '';
		this.memberSkills = '';
    }
	showToast() {
		this.dispatchEvent(
			new ShowToastEvent({
					  title: 'Successfully!',
					  message: 'Record inserted successfully.',
					  variant: 'success',
					  mode: 'pester'
				  })
		 );
	}
}