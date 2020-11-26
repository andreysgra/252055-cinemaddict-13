export default class Render {
  static renderTemplate(container, template, position = `beforeend`) {
    return container.insertAdjacentHTML(position, template);
  }
}
