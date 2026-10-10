# TASK_DECOMPOSITION.md — Prompt AI cho Lab 2 (Exercise 1, 2, 3)

> Quy tắc bắt buộc: mỗi prompt chỉ giải quyết **1 sub-task/1 commit**, không one-shot toàn bộ mini-React engine. Sau mỗi prompt → đọc code AI trả về, test bằng DevTools → mới `git commit`.

---

## Exercise 1 (35 phút): Building Mini-React VNode & Mounting Engine

### Commit 1: createElement & createTextElement factory

```
Bạn là kỹ sư frontend viết một mini-React engine thuần JavaScript
(không dùng thư viện ngoài). Hãy viết 2 hàm sau trong file
mini-react.js:

1. createTextElement(text): trả về VNode dạng
   { type: 'TEXT_ELEMENT', props: { nodeValue: String(text), children: [] } }

2. createElement(type, props, ...children): trả về VNode dạng
   { type, props: { ...props, children } }
   với yêu cầu:
   - children truyền vào có thể là mảng lồng nhau -> phải flatten
     bằng .flat(Infinity).
   - Loại bỏ children là null/undefined/false (kết quả của điều
     kiện && trong JSX).
   - Nếu 1 child không phải object (tức là string/number) thì bọc
     nó bằng createTextElement.
   - props truyền vào null thì phải fallback về object rỗng {}.

CHỈ viết 2 hàm này, chưa viết renderToDOM. Trả về code kèm export.
```

Commit: `git commit -m "feat(core): implement createElement factory"`

### Commit 2: renderToDOM (recursive mounting + XSS safety)

```
Dựa trên 2 hàm createElement/createTextElement đã có sẵn (giả định
đã tồn tại và import từ './mini-react.js'), hãy viết hàm
renderToDOM(vNode) với yêu cầu:

1. Tạo DOM node thật:
   - Nếu vNode.type === 'TEXT_ELEMENT' -> document.createTextNode(...)
   - Ngược lại -> document.createElement(vNode.type)
2. Gán thuộc tính và sự kiện:
   - Duyệt Object.keys(vNode.props), bỏ qua 'children' và 'nodeValue'.
   - Nếu tên thuộc tính bắt đầu bằng 'on' (VD onClick) -> gắn bằng
     addEventListener (KHÔNG dùng inline onclick=...).
   - Các thuộc tính còn lại gán trực tiếp qua dom[name] = value,
     RIÊNG text content của children phải dùng textContent/
     createTextNode, TUYỆT ĐỐI không dùng innerHTML (yêu cầu bảo mật
     chống XSS — kể cả khi props chứa chuỗi như
     '<img onerror=alert(1)>').
3. Đệ quy render toàn bộ vNode.props.children và append vào dom cha.
4. Trả về dom.

Chỉ viết renderToDOM, không viết lại createElement.
```

Commit: `git commit -m "feat(core): implement renderToDOM"`

### Kiểm tra trước khi nộp (DevTools Audit)

```
Đây là file mini-react.js tôi vừa hoàn thành (dán bên dưới). Hãy
viết 1 đoạn test ngắn dùng các hàm này để dựng cây UI gồm <main>,
<header>, <h1>, <p> có nội dung chứa chuỗi
'<img onerror=alert(1)> Safe Text', và 1 <button onClick>. Sau đó
assert rằng:
- document không có bất kỳ phần tử <div> nào được tạo ra không cần
  thiết.
- Chuỗi nguy hiểm trên được hiển thị dưới dạng text thuần, không
  thực thi script.
[dán code mini-react.js của bạn ở đây]
```

---

## Exercise 2 (40 phút): Reactive State Machine & Delegation Hub

### Commit 1: stateStore & resetCursor engine

```
Viết phần lõi quản lý state cho mini-React engine trong file
reactive-engine.js, CHỈ gồm:
- Một biến module-level `let stateStore = []` lưu toàn bộ giá trị
  state theo thứ tự gọi hook.
- Một biến `let cursor = 0` là con trỏ vị trí hook hiện tại.
- Hàm `resetCursor()` reset cursor về 0, được gọi trước mỗi lần
  component render lại từ đầu.
- Một biến `let triggerRender = () => {}` và hàm
  `setRenderer(fn)` để gán hàm render lại từ ngoài vào.
Không viết hàm useState ở bước này, chỉ viết phần hạ tầng lưu trữ.
```

Commit: `git commit -m "feat(state): implement stateStore and resetCursor engine"`

### Commit 2: useState dispatcher (closure-based)

```
Dựa trên stateStore, cursor, triggerRender đã có sẵn trong
reactive-engine.js (giả định đã tồn tại), hãy viết hàm
useState(initialValue) với đúng hành vi của React hook:
1. Lưu currentCursor = cursor tại thời điểm gọi (đóng gói bằng
   closure để setState sau này luôn trỏ đúng ô nhớ).
2. Nếu stateStore[currentCursor] chưa có giá trị thì gán initialValue
   (dùng toán tử ??).
3. Trả về cặp [value, setState] trong đó setState:
   - Nhận nextValue, nếu là function thì gọi
     nextValue(stateStore[currentCursor]) để lấy giá trị mới
     (hỗ trợ cú pháp setCount(c => c + 1)).
   - Chỉ cập nhật và gọi triggerRender() nếu giá trị thực sự thay
     đổi (dùng Object.is để so sánh, tránh re-render thừa).
4. Tăng cursor++ trước khi return.
Chỉ viết hàm useState này.
```

Commit: `git commit -m "feat(state): implement reactive useState dispatcher"`

### Commit 3: Root Event Delegation Hub

```
Viết hàm setupEventDelegation(rootContainer) trong file
event-delegation.js, với yêu cầu:
- Thay vì gắn addEventListener riêng lẻ cho từng phần tử, chỉ gắn
  DUY NHẤT 1 listener trên rootContainer cho mỗi loại sự kiện trong
  danh sách ['click', 'input', 'keydown'].
- Khi sự kiện xảy ra, lấy event.target rồi duyệt ngược lên
  (while target !== rootContainer) để tìm phần tử có gắn vNode
  tương ứng (giả định mỗi dom node render ra có thuộc tính
  dom.__vnode lưu lại VNode gốc).
- Tên prop handler được suy ra từ tên event, ví dụ 'click' ->
  'onClick'.
- Nếu tìm thấy target.__vnode.props[handlerProp] thì gọi hàm đó với
  nativeEvent rồi dừng việc duyệt lên (break).
Chỉ viết hàm setupEventDelegation này, không đụng vào useState.
```

Commit: `git commit -m "feat(events): attach root event delegation listener"`

### Commit 4: Lắp ráp Reactive Task Manager

```
Dùng các hàm đã có sẵn (createElement, renderToDOM, useState,
setupEventDelegation — giả định đã import đầy đủ), hãy viết component
TaskApp() là một Task Manager đơn giản, yêu cầu:
- 2 state: `tasks` (mảng string, khởi tạo 2-3 task mẫu) và `filter`
  (string, khởi tạo 'ALL').
- Hiển thị số lượng task hiện tại.
- Có nút "Add Task" khi click sẽ thêm 1 task mới vào mảng tasks
  bằng setTasks([...tasks, ...]) (không mutate mảng gốc).
- Có các nút filter (ALL/ACTIVE/DONE tuỳ bạn định nghĩa) để đổi giá
  trị filter.
- Toàn bộ UI dùng createElement (không viết trực tiếp HTML string).
- Gọi setupEventDelegation(root) đúng 1 lần khi khởi tạo ứng dụng,
  không gắn listener riêng lẻ cho từng nút.
```

Commit: `git commit -m "feat(ui): assemble reactive todo application"`

### Kiểm tra trước khi nộp

```
Đây là toàn bộ code reactive-engine.js, event-delegation.js và
TaskApp component tôi vừa hoàn thành (dán bên dưới). Hãy kiểm tra
giúp tôi 2 điều, KHÔNG viết lại code trừ khi tìm thấy lỗi:
1. Có listener nào bị gắn trực tiếp (addEventListener) lên từng
   <button> con thay vì qua root delegation hub không?
2. Khi click "Add Task" nhiều lần, state cursor có bị lệch (do hook
   gọi trong điều kiện if) hay không?
[dán code ở đây]
```

---

## Exercise 3 (35 phút): Resilient State Machine & Skeleton Loader

### Commit duy nhất: multi-state data component với skeleton feedback

```
Viết component DataFeed() dùng mini-React engine (createElement,
useState — giả định đã có sẵn), yêu cầu BẮT BUỘC:

1. Định nghĩa kiểu trạng thái (dùng JSDoc hoặc comment nếu không
   dùng TypeScript) giới hạn CHỈ 4 giá trị status:
   'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'.
   State được lưu dưới dạng 1 object duy nhất, ví dụ:
   { status: 'SUCCESS', data: [...] } hoặc { status: 'ERROR', error: '...' },
   KHÔNG dùng nhiều biến boolean rời rạc (isLoading, isError...) vì
   dễ sinh ra trạng thái mâu thuẫn nhau.

2. Hàm loadData() async:
   - Set state { status: 'LOADING' } trước khi gọi API.
   - Gọi hàm fetchFeed() (giả định đã tồn tại, trả về Promise).
   - Thành công -> { status: 'SUCCESS', data: items }.
   - Lỗi (try/catch) -> { status: 'ERROR', error: err.message }.

3. Phần render dùng createElement, rẽ nhánh theo state.status:
   - 'LOADING': render danh sách skeleton item dùng CSS shimmer
     (class 'skeleton-item'), KHÔNG render dữ liệu thật.
   - 'SUCCESS': render danh sách data thật.
   - 'ERROR': render thông báo lỗi + 1 <button> "Thử lại" gọi lại
     loadData() khi click, có role="alert" trên vùng thông báo lỗi
     để hỗ trợ screen reader.
   - 'IDLE': có thể render màn hình trống hoặc tự động gọi loadData()
     khi mount lần đầu (bạn chọn 1 cách, nêu rõ lý do ngắn gọn).

Chỉ trả về component DataFeed() này, không viết CSS skeleton (đã có
sẵn từ bài trước nếu cần tái sử dụng .skeleton-item).
```

Commit: `git commit -m "feat(ui): implement multi-state data component with skeleton feedback"`

### Kiểm tra trước khi nộp (race condition check)

```
Đây là component DataFeed() tôi vừa viết (dán bên dưới). Hãy kiểm
tra xem có race condition nào không: nếu người dùng bấm "Thử lại"
nhiều lần liên tiếp trong lúc đang LOADING, kết quả fetch cũ có thể
ghi đè lên kết quả fetch mới (hoặc ngược lại) hay không? Nếu có, chỉ
ra dòng code gây lỗi và đề xuất cách sửa ngắn gọn (ví dụ dùng biến
cờ hoặc AbortController), không cần viết lại toàn bộ component.
[dán code ở đây]
```

---



