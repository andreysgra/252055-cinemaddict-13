import AbstractView from '../view/abstract';
import {RenderPosition} from '../const';

export default class Render {
  static createElement(template) {
    const element = document.createElement(`div`);

    element.innerHTML = template;

    return element.firstElementChild;
  }

  static render(container, element, position = RenderPosition.BEFOREEND) {
    if (container instanceof AbstractView) {
      container = container.getElement();
    }

    if (element instanceof AbstractView) {
      element = element.getElement();
    }

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
    if (container instanceof AbstractView) {
      container = container.getElement();
    }

    return container.insertAdjacentHTML(position, template);
  }

  static remove(component) {
    if (!(component instanceof AbstractView)) {
      throw new Error(`Can remove only components`);
    }

    component.getElement().remove();
    component.removeElement();
  }
}
