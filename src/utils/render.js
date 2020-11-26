import {RenderPosition} from '../const';

export default class Render {
  static createElement(template) {
    const element = document.createElement(`div`);

    element.innerHTML = template;

    return element.firstElementChild;
  }

  static render(container, element, position = RenderPosition.BEFOREEND) {
    switch (position) {
      case RenderPosition.AFTERBEGIN:
        container.prepend(element);
        break;
      case RenderPosition.BEFOREEND:
        container.append(element);
        break;
      case RenderPosition.BEFOREBEGIN:
        container.before(element);
        break;
      case RenderPosition.AFTEREND:
        container.after(element);
        break;
    }
  }

  static renderTemplate(container, template, position = RenderPosition.BEFOREEND) {
    return container.insertAdjacentHTML(position, template);
  }
}
