import { getCreateComponent } from "c/test_utils";
import TeamsList from "c/teamsList";

const createComponent = getCreateComponent(TeamsList, "c-teams-list");

const TeamsMockData = require("./data/teamsData.json");
const TeamsListMockData = require("./data/teamsListMockData.json");

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

describe("c-teams-list", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe("Create component", () => {
    it("renders component correctly", () => {
      // When
      const { component } = createComponent();

      // Then
      expect(component).toMatchSnapshot();
    });
  });

  it("renders two team member card", async () => {
    // Create initial element
    const { root } = createComponent({
      teams: TeamsMockData,
      teammembers: TeamsListMockData
    });

    const teamList = root.querySelectorAll("lightning-card");
    expect(teamList.length).toBe(3);
  });
});
