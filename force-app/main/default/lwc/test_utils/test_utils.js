import { createElement } from "lwc";
export const getCreateComponent =
  (componentClass, elementName) =>
  (config = {}) => {
    const component = createElement(elementName, {
      is: componentClass
    });

    Object.assign(component, config);

    document.body.appendChild(component);

    return {
      component,
      root: component.shadowRoot
    };
  };

export const flushPromises = () =>
  new Promise((resolve) => setImmediate(resolve));

export const clearUp = () => {
  const body = document.body;

  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  jest.clearAllMocks();
};
