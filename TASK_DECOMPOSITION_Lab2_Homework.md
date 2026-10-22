# TASK_DECOMPOSITION.md — Homework (Lab 2)

**Môn:** Web Application Development — Lab 2: Modern React Architecture, Virtual DOM & State Machines
**Sinh viên:** _Phan Le Duy Bao_24520180
**Ngày nộp:** _22/10/2026_

> **RULE (Anti-Monolithic Workflow):** Mỗi sub-task được prompt AI **riêng lẻ**, kiểm tra kết quả, rồi mới `git commit` atomic (Conventional Commits). Không one-shot toàn bộ bài. Mọi prompt dưới đây là nguyên văn đã dùng; chỗ `[dán code]` là code hiện tại của em tại thời điểm prompt.

**Ràng buộc chung (project-rules.md):** Vanilla JS ES6+ / TypeScript, không thư viện UI ngoài, `const` mặc định, không `innerHTML` với dữ liệu người dùng, không inline handler, ưu tiên semantic HTML thay `<div>`.

---

## HW1: Production Enterprise Data-Grid (WCAG 2.2 AA)

**Mục tiêu:** Data-Grid có sort / filter / pagination, dùng `<table>` ngữ nghĩa, điều hướng bàn phím bằng phím mũi tên, Lighthouse Accessibility & Best Practices = 100.

| Task ID | Mô tả sub-task | Trạng thái |
|---|---|---|
| HW1-1 | Contract: `ColumnDef<T>`, `DataGridProps<T>`, ARIA invariants | [ ] |
| HW1-2 | Markup ngữ nghĩa `<table>/<thead>/<tbody>/<th scope="col">` (0 div) | [ ] |
| HW1-3 | Sorting: hàm thuần + `aria-sort` | [ ] |
| HW1-4 | Filtering: hàm thuần + ô tìm kiếm có `<label>` | [ ] |
| HW1-5 | Pagination: hàm thuần + điều khiển trang | [ ] |
| HW1-6 | Keyboard navigation (roving tabindex, Enter chọn, Space toggle) | [ ] |
| HW1-7 | Audit WCAG 2.2 AA (contrast 4.5:1, focus visible) + Lighthouse 100 | [ ] |

### HW1-1 — Contract
```
Định nghĩa bằng TypeScript (chỉ interface, KHÔNG viết logic) cho một
Data-Grid accessible:
- ColumnDef<T> { header: string; accessorKey: keyof T; sortable?: boolean }
- DataGridProps<T> { data: T[]; columns: ColumnDef<T>[];
  onRowSelect?: (item: T) => void; ariaLabel: string }
Thêm comment mô tả invariant ARIA: role="grid", role="row",
role="gridcell", và vì sao mỗi cột sortable phải có aria-sort.
Chỉ trả về phần interface + comment.
```
Commit: `docs(spec): define data-grid contract and aria invariants`

### HW1-2 — Semantic markup
```
Viết HTML tĩnh cho Data-Grid gồm 4 cột (Name, Role, Team, Status) và
3 dòng dữ liệu mẫu. Ràng buộc: dùng <table>, <caption>, <thead>,
<tbody>, <th scope="col">; mỗi tiêu đề cột sortable là một <button>
nằm trong <th>; TUYỆT ĐỐI không dùng <div>. Không CSS, không JS.
Chỉ trả về HTML.
```
Commit: `feat(html): semantic data-grid markup`

### HW1-3 — Sorting
```
Viết hàm thuần sortRows(rows, key, direction) trong sort.js: trả về
MẢNG MỚI (không mutate mảng gốc), direction là 'asc' | 'desc',
so sánh số bằng phép trừ, chuỗi bằng localeCompare. Viết thêm hàm
nextSortState(current, key) xoay vòng none -> asc -> desc -> none và
hàm ariaSortValue(state) trả 'ascending' | 'descending' | 'none'.
Không đụng DOM, chỉ logic.
```
Commit: `feat(js): pure sorting logic with aria-sort mapping`

### HW1-4 — Filtering
```
Viết hàm thuần filterRows(rows, query, keys) trong filter.js: lọc
không phân biệt hoa thường theo các cột trong keys, query rỗng trả
về toàn bộ rows. Viết thêm đoạn HTML cho ô tìm kiếm có
<label for="grid-search"> hiển thị (không dùng placeholder thay
label) và aria-describedby trỏ tới dòng gợi ý. Chỉ logic + markup
ô tìm kiếm.
```
Commit: `feat(js): pure filtering logic and labelled search input`

### HW1-5 — Pagination
```
Viết hàm thuần paginate(rows, page, pageSize) trong paginate.js trả
về { items, page, totalPages }; page được kẹp trong [1, totalPages].
Viết thêm markup <nav aria-label="Pagination"> với 2 <button>
Previous/Next, disable đúng khi ở trang đầu/cuối (dùng thuộc tính
disabled) và một vùng <p aria-live="polite"> thông báo "Page X of Y".
Không viết lại sort/filter.
```
Commit: `feat(js): pagination logic with live-region status`

### HW1-6 — Keyboard navigation
```
Viết JS cho điều hướng bàn phím của bảng (roving tabindex): chỉ một
ô có tabindex="0", các ô khác tabindex="-1". Phím ArrowUp/Down/Left/
Right di chuyển focus giữa các ô (dừng ở biên, không vòng lặp);
Enter gọi onRowSelect của dòng hiện tại; Space đổi aria-selected.
Dùng event.key (KHÔNG dùng keyCode), gọi preventDefault cho
Space/mũi tên để tránh cuộn trang, và dùng MỘT listener ủy quyền
trên <tbody>. Chỉ viết phần điều hướng.
```
Commit: `feat(a11y): roving tabindex keyboard navigation`

### HW1-7 — Audit
```
Đây là HTML + CSS của Data-Grid (dán bên dưới). Rà soát theo WCAG
2.2 AA và CHỈ sửa lỗi vi phạm: contrast chữ/nền >= 4.5:1, focus
indicator nhìn thấy rõ (không outline:none trống), target size tối
thiểu 24x24px, không phụ thuộc màu để biểu đạt trạng thái. Liệt kê
từng lỗi đã sửa + lý do. Không đổi cấu trúc ngoài phạm vi a11y.
[dán code]
```
Commit: `fix(a11y): wcag 2.2 aa contrast and focus compliance`
**Verify:** Lighthouse (Accessibility + Best Practices = 100), chụp ảnh đính kèm; thử toàn bộ chức năng chỉ bằng bàn phím.

---

## HW2: Concurrent FIFO Audio Visualizer Queue Engine

**Mục tiêu:** Web Audio API + `AnalyserNode` (FFT 256/512), hàng đợi FIFO xử lý tải/giải mã nhiều track đồng thời, huỷ được bằng `AbortController`, không rò rỉ bộ nhớ, visualizer 60fps bằng `requestAnimationFrame`.

| Task ID | Mô tả sub-task | Trạng thái |
|---|---|---|
| HW2-1 | Contract: kiểu `AudioTask`, trạng thái queue | [ ] |
| HW2-2 | `AudioTaskQueue` FIFO (enqueue/processNext, 1 task chạy tại 1 thời điểm) | [ ] |
| HW2-3 | Fetch + `decodeAudioData` có `AbortSignal` | [ ] |
| HW2-4 | Playback graph: `AudioBufferSourceNode` → `AnalyserNode` → destination | [ ] |
| HW2-5 | Visualizer Canvas bằng `requestAnimationFrame` | [ ] |
| HW2-6 | Cleanup & audit memory leak | [ ] |

### HW2-1 — Contract
```
Định nghĩa bằng TypeScript (chỉ kiểu, KHÔNG logic): interface
AudioTask { trackUrl: string; controller: AbortController;
resolve: (b: AudioBuffer) => void; reject: (e: unknown) => void },
và type QueueState = 'IDLE' | 'PROCESSING'. Thêm comment mô tả
invariant: tối đa 1 task ở trạng thái PROCESSING; thứ tự xử lý
đúng thứ tự enqueue (FIFO).
```
Commit: `docs(spec): define audio task queue contract`

### HW2-2 — FIFO controller
```
Dựa trên interface AudioTask đã có, viết class AudioTaskQueue với:
mảng private queue, cờ isProcessing, method enqueue(trackUrl) trả
Promise<AudioBuffer> (đẩy task vào cuối hàng rồi gọi processNext()),
và processNext() lấy task ĐẦU hàng bằng shift(); nếu đang xử lý
hoặc hàng rỗng thì return. Trong processNext dùng một hàm
loadTrack(task) CHƯA cài đặt (để stub ném lỗi 'not implemented').
Dùng try/finally để luôn reset isProcessing và gọi tiếp processNext().
Không viết fetch/decode ở bước này.
```
Commit: `feat(queue): implement fifo audio task queue`

### HW2-3 — Fetch + decode có huỷ
```
Viết hàm async loadTrack(task, audioCtx) cho AudioTaskQueue: fetch
task.trackUrl với { signal: task.controller.signal }, kiểm tra
response.ok (ném lỗi nếu không), lấy arrayBuffer rồi
audioCtx.decodeAudioData. Thành công -> task.resolve(buffer); lỗi
-> nếu error.name === 'AbortError' thì reject với lỗi huỷ rõ ràng,
còn lại reject với lỗi gốc. Chỉ viết hàm này.
```
Commit: `feat(audio): fetch and decode with abort support`

### HW2-4 — Playback graph
```
Viết hàm playBuffer(audioCtx, buffer, analyser) tạo
AudioBufferSourceNode, nối source -> analyser -> audioCtx.destination,
start(), và trả về object { source, stop() }. Viết thêm hàm
createAnalyser(audioCtx, fftSize = 256) đặt analyser.fftSize và
smoothingTimeConstant = 0.8. Lưu ý: nếu audioCtx.state ==='suspended'
thì chỉ resume() bên trong handler của thao tác người dùng. Không
viết phần vẽ.
```
Commit: `feat(audio): playback graph with analyser node`

### HW2-5 — Visualizer
```
Viết hàm startVisualizer(canvas, analyser) vẽ phổ tần số dạng cột:
dùng Uint8Array(analyser.frequencyBinCount) tạo MỘT LẦN ngoài vòng
lặp, mỗi frame gọi analyser.getByteFrequencyData, vẽ bằng Canvas 2D,
lặp bằng requestAnimationFrame. Trả về hàm stop() gọi
cancelAnimationFrame. Màu lấy từ CSS custom property (không hardcode
hex). Không cấp phát mảng mới trong mỗi frame.
```
Commit: `feat(ui): 60fps canvas frequency visualizer`

### HW2-6 — Audit rò rỉ
```
Đây là toàn bộ code audio queue + visualizer (dán bên dưới). Rà soát
rò rỉ: AudioBufferSourceNode có disconnect()/stop() khi kết thúc
(onended) chưa? rAF có bị huỷ khi dừng chưa? AbortController của
task bị huỷ có dọn khỏi hàng đợi chưa? Chỉ ra dòng gây lỗi và đề
xuất sửa ngắn gọn, không viết lại toàn bộ.
[dán code]
```
Commit: `fix(audio): cleanup source nodes and cancel pending tasks`
**Verify:** Chrome DevTools → Memory/Performance: phát 20 track liên tiếp, heap không tăng đều; FPS visualizer ổn định ~60.

---

## HW3: High-Concurrency Flash-Sale E-Commerce Engine (11.11)

**Mục tiêu:** Đồng hồ đếm ngược không trôi (drift-free), state machine khoá tồn kho lạc quan (reserve → lock expiry → checkout), ít nhất **8 commit atomic** theo Conventional Commits, và báo cáo `AI_FAILURE_AUDIT.md` ghi ít nhất 3 lỗi do AI sinh ra.

| Task ID | Mô tả sub-task | Trạng thái |
|---|---|---|
| HW3-1 | Contract & spec: kiểu dữ liệu, trạng thái, bảng chuyển trạng thái | [ ] |
| HW3-2 | Anti-drift timer (`Date.now()` delta + rAF) | [ ] |
| HW3-3 | Gắn countdown vào UI (mốc UTC ISO 8601, `aria-live` hợp lý) | [ ] |
| HW3-4 | Inventory state machine (hàm thuần `transition`) | [ ] |
| HW3-5 | Reserve + lock expiry | [ ] |
| HW3-6 | Checkout + release khi hết hạn/huỷ | [ ] |
| HW3-7 | Chống double-submit & sanitize input | [ ] |
| HW3-8 | UI skeleton/loading/error cho luồng mua | [ ] |
| HW3-9 | `AI_FAILURE_AUDIT.md` (>= 3 lỗi) | [ ] |

### HW3-1 — Contract & spec
```
Định nghĩa bằng TypeScript (chỉ kiểu, không logic) cho flash-sale:
type InventoryState = 'AVAILABLE' | 'RESERVED' | 'CHECKOUT' | 'SOLD'
| 'EXPIRED'; type InventoryEvent = 'RESERVE' | 'CONFIRM' | 'CANCEL'
| 'EXPIRE'; interface Reservation { itemId: string; userId: string;
expiresAt: number }. Kèm bảng chuyển trạng thái hợp lệ dạng comment
(ví dụ AVAILABLE --RESERVE--> RESERVED) và nêu các chuyển trạng
thái BỊ CẤM (ví dụ SOLD --RESERVE--> ...).
```
Commit: `docs(spec): define flash-sale contracts and state table`

### HW3-2 — Anti-drift timer
```
Viết hàm createAntiDriftTimer(durationMs, onTick) trong timer.ts:
tính targetTime = Date.now() + durationMs MỘT LẦN, mỗi frame tính
remaining = Math.max(0, targetTime - Date.now()) rồi gọi
onTick(remaining); lặp bằng requestAnimationFrame cho tới khi
remaining = 0. Trả về hàm huỷ gọi cancelAnimationFrame. TUYỆT ĐỐI
không đếm cộng dồn bằng setInterval. Chỉ viết hàm này.
```
Commit: `feat(timer): drift-free countdown engine`

### HW3-3 — Countdown UI
```
Viết hàm formatRemaining(ms) trả "HH:MM:SS" và đoạn JS gắn timer vào
<time id="sale-countdown" datetime="...">. Mốc kết thúc là chuỗi UTC
ISO 8601 (ví dụ '2026-11-11T17:00:00Z') và phải parse bằng Date.parse
để không phụ thuộc múi giờ máy. Cập nhật bằng textContent. KHÔNG đặt
aria-live trên phần tử cập nhật mỗi giây (gây ồn screen reader); chỉ
thông báo khi còn 60s và khi kết thúc qua một vùng role="status"
riêng. Không viết lại timer.
```
Commit: `feat(ui): bind countdown to utc deadline with accessible announcements`

### HW3-4 — Inventory state machine
```
Dựa trên các kiểu đã định nghĩa, viết hàm thuần
transition(state, event): InventoryState tra bảng chuyển trạng thái;
chuyển không hợp lệ thì ném Error mô tả rõ (không im lặng bỏ qua).
Viết kèm 6 test case bằng console.assert, bao gồm ít nhất 2 case
chuyển trạng thái bị cấm. Không có side-effect, không đụng DOM.
```
Commit: `feat(state): pure inventory state machine`

### HW3-5 — Reserve + expiry
```
Viết hàm reserveItem(store, itemId, userId, ttlMs) cho flash-sale:
nếu item đang AVAILABLE thì chuyển RESERVED, ghi Reservation với
expiresAt = Date.now() + ttlMs, và đặt một setTimeout để tự gọi
EXPIRE khi hết hạn (lưu timeout id để huỷ được). Nếu item không
AVAILABLE thì trả { ok: false, reason }. Không viết checkout.
```
Commit: `feat(inventory): optimistic reservation with ttl expiry`

### HW3-6 — Checkout & release
```
Viết confirmCheckout(store, itemId, userId) và cancelReservation(store,
itemId, userId). confirm: chỉ hợp lệ khi item đang RESERVED bởi đúng
userId và CHƯA quá expiresAt; thành công thì clearTimeout của hẹn giờ
hết hạn và chuyển SOLD. cancel: trả item về AVAILABLE và clearTimeout.
Mọi chuyển trạng thái đi qua hàm transition đã có. Không viết UI.
```
Commit: `feat(inventory): checkout and release flow`

### HW3-7 — Double-submit & sanitize
```
Rà soát đoạn JS xử lý form mua hàng sau (dán bên dưới) và bổ sung:
(1) chặn double-submit: bỏ qua mọi lần submit khi đang ở trạng thái
'submitting', disable nút trong lúc chờ; (2) mọi dữ liệu người dùng
nhập (tên, địa chỉ) hiển thị lại bằng textContent, KHÔNG innerHTML.
Liệt kê lỗ hổng XSS/race tìm thấy và cách đã sửa.
[dán code]
```
Commit: `fix(security): prevent double-submit and sanitize rendered input`

### HW3-8 — Trạng thái UI của luồng mua
```
Viết HTML + JS cho 3 trạng thái UI của nút "Mua ngay": loading
(skeleton CSS cho giá/tồn kho), error (thông báo role="alert" + nút
"Thử lại" focus được bằng bàn phím), và hết hàng (nút disabled kèm
văn bản giải thích, không chỉ đổi màu). Tái sử dụng .skeleton-item
nếu có. Không viết lại state machine.
```
Commit: `feat(ui): loading, error and sold-out states for purchase flow`

### HW3-9 — AI Failure Mode Audit
Điền `AI_FAILURE_AUDIT.md` với **ít nhất 3 lỗi AI thực sự gặp khi làm bài** (không bịa). Mỗi lỗi gồm: Prompt đã dùng → Code AI sinh ra → Rủi ro → Cách phát hiện (Git diff / DevTools) → Bản sửa. Các lớp lỗi thường gặp để em đối chiếu với trường hợp thật của mình:
- Timer cộng dồn bằng `setInterval` gây drift (HW3-2).
- `innerHTML` với dữ liệu người dùng → XSS (HW3-7).
- Quên `clearTimeout` khi confirm/cancel → hết hạn "ma" làm item bị nhả sai (HW3-5/6).
- Không kiểm tra `userId` khi checkout → người khác mua giữ chỗ của mình (HW3-6).

Prompt hỗ trợ rà soát:
```
Đây là code do AI sinh ra trước đó (dán bên dưới). Đóng vai senior
reviewer, chỉ ra tối đa 3 vấn đề nghiêm trọng nhất về: timer drift,
XSS, memory leak (chưa clear timeout/listener), race condition. Mỗi
vấn đề: nguyên nhân + cách sửa ngắn gọn, không viết lại toàn bộ.
[dán code]
```
Commit: `docs(audit): add ai failure mode report`

---

## Tổng kết Git History (điền trước khi nộp)
```
git log --oneline
```
_(dán kết quả vào đây; HW3 cần tối thiểu 8 commit)_

## Ghi chú
- Mỗi prompt = 1 sub-task = 1 commit; không gộp CSS/JS/HTML của nhiều sub-task vào cùng một commit.
- Trước mỗi commit: đọc `git diff`, chắc chắn AI không tự thêm thư viện ngoài hoặc `innerHTML`.
- Chuẩn bị Live Defense (60-180 giây): thầy có thể đổi một biến kiến trúc (ví dụ đổi hàng đợi đồng bộ sang microtask, đổi TTL, hoặc thêm trạng thái mới vào state machine) và yêu cầu em sửa + kiểm chứng ngay trong DevTools. Cần hiểu từng dòng code AI sinh ra.
