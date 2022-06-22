import { api, LightningElement, track } from 'lwc';
import getTeamMembers from '@salesforce/apex/CustomController.getTeamMembers';
import getAllTeamMembers from '@salesforce/apex/CustomController.getAllTeamMembers';

export default class TeamsList extends LightningElement {
  @api teams;
  @track teamId = "";
  @track teamMembersList = [];
  @api
  get teammembers() {
    return this.teamMembersList;
  }
  set teammembers(values) {
    if (values && typeof values === "string") {
      values = JSON.parse(values);
    }
    this.teamMembersList = values;
  }

  get isMember() {
    return this.teamMembersList.length > 0 ? true : false;
  }

  get teamList() {
    let list = [];
    list.push({ label: "None", value: null });
    if (this.teams) {
      this.teams.forEach((team) => {
        list.push({ label: team.Name, value: team.Id });
      });
    }
    return list;
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    if (this.teamId == null) {
      getAllTeamMembers().then((data) => {
        if (data) {
          this.teamMembersList = data;
        }
      });
    } else {
      getTeamMembers({ teamId: this.teamId }).then((data) => {
        if (data) {
          this.teamMembersList = data;
        }
      });
    }
  }
}