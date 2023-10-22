import { AnyEvent, ProgressiveElement, findClosestIntention } from './progressive-element';

interface Todo {
  text: string;
  checked: boolean;
}

class TodoApp extends ProgressiveElement {
  static delegatedEvents = ['click', 'submit', 'change'];

  newTodo: HTMLInputElement = this.querySelector('#new-todo')!;
  count = this.querySelector('#todo-count')!;
  todos = this.querySelector('#todos')!;
  todoTemplate: HTMLTemplateElement = document.querySelector('#todo-template')!;

  connectedCallback() {
    // If there is no filter attribute, try it extract it from the URL's hash.
    if (!this.hasAttribute('filter')) {
      const value = location.hash.replace('#', '') || 'all';
      this.setAttribute('filter', value);
    }

    const todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
    for (const { text, checked } of todos) {
      this.addTodo(text, checked);
    }
  }

  handleEvent(event: AnyEvent) {
    const { intention, target } = findClosestIntention(event);

    switch (intention) {
      case 'ADD_TODO': {
        (event as SubmitEvent).preventDefault();
        this.addTodo(target.querySelector('input')?.value);
        break;
      }
      case 'REMOVE_TODO': {
        target.closest('li')?.remove();
        break;
      }
      case 'TODO_TOGGLED': {
        this.updateItemsLeft();
        break;
      }
      case 'FILTER': {
        const value = target.getAttribute('filter');

        if (!value) return;

        this.setAttribute('filter', value);
        break;
      }
      case 'MARK_ALL_COMPLETED': {
        this.querySelectorAll('#todos input[type="checkbox"]:not(:checked)').forEach((el) => {
          (el as HTMLInputElement).checked = true;
        });
        this.count.textContent = '0';
        break;
      }
      case 'CLEAR_COMPLETED': {
        this.querySelectorAll('#todos li:has(input[type="checkbox"]:checked)').forEach((el) => {
          el.remove();
        });
        break;
      }
    }
    this.persistTodos();
  }

  addTodo(text: string = '', checked = false) {
    const li = this.todoTemplate.content.cloneNode(true) as HTMLElement;
    const textInput = li.querySelector('input[type="text"]') as HTMLInputElement;
    textInput.value = text;

    const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.checked = checked;

    this.todos.appendChild(li);
    this.newTodo.value = '';
    this.updateItemsLeft();
  }

  updateItemsLeft() {
    const count = this.querySelectorAll('#todos input[type="checkbox"]:not(:checked)').length;
    this.count.textContent = count.toString();
  }

  persistTodos() {
    const todos: Todo[] = Array.from(this.querySelectorAll('#todos li')).map((li) => {
      const textInput = li.querySelector('input[type="text"]') as HTMLInputElement;
      const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
      return {
        text: textInput.value || '',
        checked: checkbox.checked,
      };
    });

    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

TodoApp.register();

declare global {
  interface HTMLElementTagNameMap {
    'todo-app': TodoApp;
  }
}
