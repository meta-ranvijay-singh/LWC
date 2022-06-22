import TeamsApp from "c/teamsApp";
//import { mockToast } from "@ffdev/lwc-test-utils/lightning/platformShowToast";
import { ShowToastEventName } from "lightning/platformShowToastEvent";
import { getCreateComponent, flushPromises, clearUp } from "c/test_utils";
import { SEVERITY, TOAST_MODE } from "../const";
import getTeamList from "@salesforce/apex/CustomController.getTeamList";
import getAllTeamMembers from "@salesforce/apex/CustomController.getAllTeamMembers";
import insertMember from "@salesforce/apex/CustomController.insertMember";

const TeamsMockData = require("./data/teamsData.json");
const TeamsMemeberMockData = require("./data/teamMemberData.json");

const createComponent = getCreateComponent(TeamsApp, "c-teams-app");

//jest.mock("lightning/platformShowToastEvent", () => mockToast);

jest.mock(
  "@salesforce/apex/CustomController.getTeamList",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex/CustomController.getAllTeamMembers",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex/CustomController.insertMember",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

describe("c--teams-app", () => {
  afterEach(clearUp);

  describe("Create component", () => {
    it("renders component correctly", () => {
      // When
      const { component } = createComponent();

      getTeamList.emit(TeamsMockData);
      getAllTeamMembers.emit(TeamsMemeberMockData);

      // Then
      expect(component).toMatchSnapshot();
    });
  });

  describe("Handle events", () => {
    it("verify data insert successfully", async () => {
      // When
      const { component, root } = createComponent();
      let mockMember = {
        Id: "1234",
        Name: "Harry",
        Team__c: TeamsMockData[0].Id,
        Team__r: {
          Name: TeamsMockData[0].Name
        },
        Skills__c: "Batsman"
      };

      getTeamList.emit(TeamsMockData);
      getAllTeamMembers.emit(TeamsMemeberMockData);
      insertMember.mockResolvedValue(mockMember);

      const showToastEventHandler = jest.fn();
      component.addEventListener(ShowToastEventName, showToastEventHandler);

      let memberSkillComponent = root.querySelector("c-member-skills");
      memberSkillComponent.dispatchEvent(
        new CustomEvent("insert", {
          detail: {
            memberName: mockMember.Name,
            teamId: mockMember.Team__c + ":" + mockMember.Team__r.Name,
            memberSkills: mockMember.Skills__c
          }
        })
      );

      // Then
      await flushPromises();
      expect(insertMember).toBeCalledTimes(1);
      expect(showToastEventHandler).toHaveBeenCalled();
      expect(showToastEventHandler.mock.calls[0][0].detail.variant).toBe(
        SEVERITY.success
      );
      expect(showToastEventHandler.mock.calls[0][0].detail.mode).toBe(
        TOAST_MODE.dismissable
      );
    });

    it("verify data insert failure", async () => {
      // When
      const { component, root } = createComponent();

      getTeamList.emit(TeamsMockData);
      getAllTeamMembers.emit(TeamsMemeberMockData);
      insertMember.mockResolvedValue(false);

      const showToastEventHandler = jest.fn();
      component.addEventListener(ShowToastEventName, showToastEventHandler);

      let memberSkillComponent = root.querySelector("c-member-skills");
      memberSkillComponent.dispatchEvent(
        new CustomEvent("insert", {
          detail: {
            memberName: "Harry",
            teamId: TeamsMockData[0].Id + ":" + TeamsMockData[0].Name,
            memberSkills: "Batsman"
          }
        })
      );

      // Then
      await flushPromises();
      expect(insertMember).toBeCalledTimes(1);
      expect(showToastEventHandler).toHaveBeenCalled();
      expect(showToastEventHandler.mock.calls[0][0].detail.variant).toBe(
        SEVERITY.error
      );
      expect(showToastEventHandler.mock.calls[0][0].detail.mode).toBe(
        TOAST_MODE.dismissable
      );
    });
  });
});
