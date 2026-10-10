/**
 * DataFeed status chỉ nhận một trong 4 giá trị:
 * 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'
 *
 * State được quản lý bằng một object duy nhất.
 */
import { createElement, renderToDOM } from '../Ex1/mini-react.js';
import {
  useState,
  resetCursor,
  setRenderer
} from '../Ex2/reactive-engine.js';
import { setupEventDelegation } from '../Ex2/event-delegation.js';

async function fetchFeed() {
  // Giả lập API trả dữ liệu sau 1,5 giây
  await new Promise(resolve => setTimeout(resolve, 1500));

  return [
    { id: 1, title: 'Learn JavaScript' },
    { id: 2, title: 'Build Mini React' },
    { id: 3, title: 'Complete Exercise 3' }
  ];
}

const root = document.getElementById('root');

function renderApp() {
  resetCursor();

  const appDOM = renderToDOM(DataFeed());

  root.replaceChildren(appDOM);
}

setupEventDelegation(root);
setRenderer(renderApp);
renderApp();

function DataFeed() {
  const [feedState, setFeedState] = useState({
    status: 'IDLE'
  });

  async function loadData() {
    // Chuyển sang LOADING trước khi gọi API
    setFeedState({ status: 'LOADING' });

    try {
      const items = await fetchFeed();

      setFeedState({
        status: 'SUCCESS',
        data: items
      });
    } catch (err) {
      setFeedState({
        status: 'ERROR',
        error: err instanceof Error
          ? err.message
          : String(err)
      });
    }
  }

  // IDLE: hiển thị nút tải dữ liệu lần đầu.
  // Cách này tránh tự gọi API trong lúc render.
  if (feedState.status === 'IDLE') {
    return createElement(
      'section',
      { className: 'data-feed' },
      createElement('h2', {}, 'Data Feed'),
      createElement(
        'button',
        { onClick: loadData },
        'Tải dữ liệu'
      )
    );
  }

  // LOADING: chỉ hiển thị skeleton, không hiển thị dữ liệu cũ.
  if (feedState.status === 'LOADING') {
    return createElement(
      'section',
      {
        className: 'data-feed',
        'aria-busy': 'true'
      },
      createElement('h2', {}, 'Data Feed'),
      createElement(
        'div',
        { className: 'skeleton-list' },
        ...Array.from({ length: 3 }, (_, index) =>
          createElement('div', {
            key: index,
            className: 'skeleton-item',
            'aria-hidden': 'true'
          })
        )
      )
    );
  }

  // SUCCESS: hiển thị dữ liệu thật.
  if (feedState.status === 'SUCCESS') {
    return createElement(
      'section',
      { className: 'data-feed' },
      createElement('h2', {}, 'Data Feed'),
      createElement(
        'ul',
        {},
        ...feedState.data.map((item, index) =>
          createElement(
            'li',
            { key: item.id ?? index },
            String(item.title ?? item.name ?? item)
          )
        )
      )
    );
  }

  // ERROR: thông báo lỗi và nút thử lại.
  if (feedState.status === 'ERROR') {
    return createElement(
      'section',
      { className: 'data-feed' },
      createElement('h2', {}, 'Data Feed'),
      createElement(
        'div',
        { role: 'alert' },
        createElement(
          'p',
          {},
          `Không thể tải dữ liệu: ${feedState.error}`
        ),
        createElement(
          'button',
          { onClick: loadData },
          'Thử lại'
        )
      )
    );
  }

  return createElement('section', { className: 'data-feed' });
}

