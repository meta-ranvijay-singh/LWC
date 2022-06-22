import { api, LightningElement, track } from 'lwc';

export default class MemberSkills extends LightningElement {
  @api teams;
  @track teamId = "";
  @track memberName = "";
  @track memberSkills = "";
  @track error;

  get teamList() {
    let list = [];
    if (this.teams) {
      this.teams.forEach((team) => {
        list.push({ label: team.Name, value: team.Id + ":" + team.Name });
      });
    }
    return list;
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
  }
  handleSubmit() {
    this.validation();
    if (this.isEmpty(this.error)) {
      this.dispatchEvent(
        new CustomEvent("insert", {
          detail: {
            memberName: this.memberName,
            teamId: this.teamId,
            memberSkills: this.memberSkills
          }
        })
      );
      this.teamId = "";
      this.memberName = "";
      this.memberSkills = "";
    }
  }
  validation() {
    if (this.isEmpty(this.memberName.trim())) {
      this.error = "Please enter Member Name.";
    } else if (this.isEmpty(this.teamId.trim())) {
      this.error = "Please select team.";
    } else if (this.isEmpty(this.memberSkills.trim())) {
      this.error = "Please enter Skills.";
    } else {
      this.error = null;
    }
  }
  isEmpty(string) {
    if (string === "" || string === null || string === undefined) {
      return true;
    }

    return false;
  }
}