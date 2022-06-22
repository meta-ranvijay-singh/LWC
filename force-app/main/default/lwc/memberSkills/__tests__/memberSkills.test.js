import { getCreateComponent, flushPromises } from "c/test_utils";
import MemberSkills from "c/memberSkills";

const createComponent = getCreateComponent(MemberSkills, "c-member-skills");

const TeamsMockData = require("./data/teamsData.json");

describe("c-member-skills", () => {
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

  it("verify data insert on submit button click", async () => {
    // Create initial element
    const { root, component } = createComponent({ teams: TeamsMockData });

    let inputField = root.querySelectorAll("lightning-input");

    let name = inputField[0];
    name.value = "Tom";
    name.dispatchEvent(new CustomEvent("change"));

    let skill = inputField[1];
    skill.value = "Batsman";
    skill.dispatchEvent(new CustomEvent("change"));

    let combo = root.querySelectorAll("lightning-combobox")[0];
    combo.value = TeamsMockData[0].Id;
    combo.dispatchEvent(new CustomEvent("change"));

    const submitButton = root.querySelectorAll("lightning-button")[0];

    const handler = jest.fn();
    component.addEventListener("insert", handler);

    submitButton.dispatchEvent(new CustomEvent("click"));

    await flushPromises();
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
