import { api, LightningElement } from "lwc";
import template from "./teamsList.tpl.html";

class TeamsList extends LightningElement {
  @api teams;
  @api teammembers;

  render() {
    return template;
  }
}

export default TeamsList;
