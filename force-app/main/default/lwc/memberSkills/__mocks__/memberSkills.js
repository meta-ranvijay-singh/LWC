import { api, LightningElement } from "lwc";
import template from "./memberSkills.tpl.html";

class MemberSkills extends LightningElement {
  @api teams;

  render() {
    return template;
  }
}

export default MemberSkills;
