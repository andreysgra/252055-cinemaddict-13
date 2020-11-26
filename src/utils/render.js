import {RenderPosition} from '../const';

export default class Render {
  static createElement(template) {
    const element = document.createElement(`div`);

    element.innerHTML = template;

    return element.firstElementChild;
  }

  static renderElement(container, element, position = RenderPosition.BEFOREEND) {
    switch (position) {
      case RenderPosition.AFTERBEGIN:
        container.prepend(element);
        break;
      case RenderPosition.BEFOREEND:
        container.append(element);
        break;
      case RenderPosition.AFTEREND:
        container.parentNode.insertBefore(element, container.nextSibling);
        break;
    }
  }

  static renderTemplate(container, template, position = `beforeend`) {
    return container.insertAdjacentHTML(position, template);
  }
}
