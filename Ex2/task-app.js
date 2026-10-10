import { createElement, renderToDOM } from '../Ex1/mini-react.js';
import { setupEventDelegation } from './event-delegation.js';
import {
  useState,
  resetCursor,
  setRenderer
} from './reactive-engine.js';
function TaskApp() {
  const [tasks, setTasks] = useState([
    'Learn JavaScript',
    'Build mini-React',
    'Practice CSS'
  ]);

  const [filter, setFilter] = useState('ALL');

  const addTask = () => {
    const newTask = `New Task ${tasks.length + 1}`;
    setTasks([...tasks, newTask]);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return !task.startsWith('[DONE] ');
    if (filter === 'DONE') return task.startsWith('[DONE] ');
    return true;
  });

  const markDone = (task) => {
    setTasks(
      tasks.map(item =>
        item === task && !item.startsWith('[DONE] ')
          ? `[DONE] ${item}`
          : item
      )
    );
  };

  return createElement(
    'div',
    { className: 'task-app' },

    createElement('h1', {}, 'Task Manager'),

    createElement(
      'p',
      {},
      `Total tasks: ${tasks.length}`
    ),

    createElement(
      'button',
      { onClick: addTask },
      'Add Task'
    ),

    createElement(
      'div',
      { className: 'filters' },

      createElement(
        'button',
        { onClick: () => setFilter('ALL') },
        'ALL'
      ),

      createElement(
        'button',
        { onClick: () => setFilter('ACTIVE') },
        'ACTIVE'
      ),

      createElement(
        'button',
        { onClick: () => setFilter('DONE') },
        'DONE'
      )
    ),

    createElement(
      'ul',
      {},
      ...filteredTasks.map(task =>
        createElement(
          'li',
          {},
          task,

          !task.startsWith('[DONE] ') &&
            createElement(
              'button',
              { onClick: () => markDone(task) },
              'Mark Done'
            )
        )
      )
    )
  );
}

// Khởi tạo ứng dụng
const root = document.getElementById('root');

setupEventDelegation(root);

function renderApp() {
  resetCursor();

  const appVNode = TaskApp();
  const appDOM = renderToDOM(appVNode);

  root.replaceChildren(appDOM);
}

setRenderer(renderApp);
renderApp();