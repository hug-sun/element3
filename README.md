# (wip) element for vue3

1. 修改 build/bin/buld-entry.js 的 72 行。
2. 组件加上白名单，比如加一个 'input'，执行 `npm run dev`。
3. 访问文档(也可访问 http://localhost:8086/#/ )，在对应的组件页面调试报错即可，完成的记得标记。
4. 提交代码前请先拉取代码，commit 时信息格式为 key: content，如 `refactor: refactor alert`，注意表达简洁易懂。

## Join Discussion Group

Scan the QR code using [Dingtalk App](https://www.dingtalk.com/) to join in discussion group :

<img alt="Join Discusion Group" src="https://pic4.zhimg.com/80/v2-73947edcba4cbfe52cd779a3b1b974b5_1440w.png" width="300">

## Contribution

[See Contributing Guide.](https://juejin.im/post/6864462363039531022)

<p align="center">
<img src="data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE1NXB4IiBoZWlnaHQ9IjM4cHgiIHZpZXdCb3g9IjAgMCAxNTUgMzgiPgo8ZGVmcz4KPGcgaWQ9IkxheWVyMV8wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjNDA5RUZGIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDY0LjE1IDEzOC45ClEgNjUuMDUgMTM5LjIgNjUuOTUgMTM5LjI1IDY1LjM1IDEzOS4yIDY0Ljc1IDEzOS4wNSA2NC40IDEzOC45NSA2NC4xNSAxMzguOQpNIDY1Ljk1IDEyNi40NQpMIDY2IDEyNi40NSA2NS45NSAxMjYuNCA2NS45NSAxMjYuNDUKTSAxMTcuNyAzMy4xNQpMIDExNi4xIDMyLjIKUSAxMTUuNzUgMzIuNTUgMTE2IDMyLjYgMTE2LjkgMzIuNzUgMTE3LjcgMzMuMTUKTSAxMjEgMzguNQpMIDEyMSAzOC45NQpRIDEyMS4wNSAzOC4zIDEyMC45NSAzNy42NSAxMjEgMzguMDUgMTIxIDM4LjUKTSA5Ny4xIDM1LjM1CkwgMTEwLjYgMjcuNSA2NC42NSAwLjkKUSA2MS4zIC0wLjkgNTggMC45CkwgMy41IDMyLjQgMS44NSAzMy45ClEgMCAzNS41NSAwIDM3LjQKTCAwIDEwMi45NSAwLjIgMTA0LjI1ClEgMC43NSAxMDUuNSAyLjA1IDEwNi40NQpMIDU1Ljk1IDEzNy45IDU1Ljk1IDEyMi43IDE0LjM1IDk4LjUKUSAxMy4yNSA5Ny44IDEyLjkgOTYuNwpMIDEyLjcgOTUuNzUgMTIuNyA0NC41NQpRIDEyLjcgNDMuMSAxNC4yIDQxLjYKTCAxNS40NSA0MC41IDU4LjM1IDE1Ljg1ClEgNjAuOTUgMTQuNTUgNjMuNTUgMTUuODUKTCA5Ny4xIDM1LjM1Ck0gMjA0LjIgMzcKUSAyMDUuNSAzNC4wNSAyMDIuNzUgMzQuMDUKTCAxNTUuMjUgMzQuMDUKUSAxNTQuNyAzNC4yNSAxNTMuOTUgMzQuOCAxNTIuNjUgMzUuNyAxNTIuNjUgMzcuNTUKTCAxNTIuNjUgMTA0LjYgMTUzLjQgMTA2LjA1ClEgMTU0LjMgMTA3LjU1IDE1NS42IDEwNy41NQpMIDIwNi44IDEwNy41NQpRIDIwOC42NSAxMDcuMTUgMjA3LjM1IDEwNC45NQpMIDIwMi43NSA5Ny45NQpRIDIwMiA5Ni41IDE5OS44IDk2LjUKTCAxNjcuNCA5Ni41ClEgMTY0LjggOTUuNzUgMTY0LjggOTMuMzUKTCAxNjQuOCA3NS43IDE5NC4xIDc1LjcKUSAxOTYuMyA3NS43IDE5Ny4yIDc0LjA1CkwgMjAwLjcgNjcuMDUKUSAyMDEuOCA2NC40NSAxOTkuOCA2NC40NQpMIDE2NC44IDY0LjQ1IDE2NC44IDQ3LjcgMTY1LjIgNDYuNgpRIDE2Ni4xIDQ1LjMgMTY3Ljc1IDQ1LjMKTCAxOTguNyA0NS4zClEgMjAwLjcgNDUuMSAyMDEuOCA0My4yNQpMIDIwNC4yIDM3Ck0gMjQ3Ljg1IDk4LjUKUSAyNDYuNzUgOTYuMyAyNDQuOSA5NS45NQpMIDIzNS4xNSA5NS45NQpRIDIzMS40NSA5NC44NSAyMjkuNDUgOTIuMjUKTCAyMjguMTUgODkuODUgMjI4LjE1IDM2LjY1ClEgMjI4LjE1IDM0LjYgMjI2LjcgMzMuOQpMIDIyNS4wNSAzMy41IDIxNiAzMy41ClEgMjE1LjggNzguNDUgMjE2IDkyLjggMjE2Ljc1IDEwMS42NSAyMjMuOSAxMDUuNSAyMjcuNiAxMDcuMzUgMjMxLjEgMTA3LjU1CkwgMjUwLjQ1IDEwNy41NQpRIDI1Mi4zIDEwNy41NSAyNTEuOSAxMDUuNQpMIDI0Ny44NSA5OC41Ck0gMjYxLjUgNTUuNDUKUSAyNjAuNTUgNTUuNiAyNTkuODUgNTYuMTUgMjU4IDU3LjI1IDI1OCA1OC45NQpMIDI1OCAxMDIgMjU5LjEgMTA0LjgKUSAyNjAuNzUgMTA3LjU1IDI2My41IDEwNy41NQpMIDMwMS42NSAxMDcuNTUKUSAzMDMuODUgMTA3LjU1IDMwMy4xIDEwNS41CkwgMzAwIDk4LjkKUSAyOTguODUgOTcuNCAyOTcuMDUgOTcuNApMIDI3MS42IDk3LjQKUSAyNjguMSA5Ni43IDI2OC4xIDkzLjkKTCAyNjguMSA4Ni4zNSAyOTkuNiA4Ni4zNQpRIDMwNC4wNSA4NS40NSAzMDQuMDUgODEuNzUKTCAzMDQuMDUgNTkuODUKUSAzMDMuMyA1NS40NSAyOTkuNiA1NS40NQpMIDI2MS41IDU1LjQ1Ck0gMjY4LjEgNzMuNjUKTCAyNjguMSA2Ny45NQpRIDI2OC4xIDY2Ljg1IDI2OS40IDY2LjEgMjcwLjE1IDY1Ljc1IDI3MC43IDY1LjU1CkwgMjkxLjUgNjUuNTUKUSAyOTMuNyA2NS41NSAyOTMuOSA2Ny45NQpMIDI5My45IDczLjEKUSAyOTMuOSA3NS41IDI5MS41IDc2LjI1CkwgMjcwLjcgNzYuMjUKUSAyNjkuMiA3Ni4yNSAyNjguNSA3NC45NQpMIDI2OC4xIDczLjY1Ck0gMzYxLjg1IDY1Ljc1ClEgMzYzLjMgNjYuNjUgMzYzLjMgNjcuOTUKTCAzNjMuMyAxMDYuMDUgMzYzLjcgMTA2LjgKUSAzNjQuMjUgMTA3LjU1IDM2NSAxMDcuNTUKTCAzNzMuMSAxMDcuNTUKUSAzNzQuNTUgMTA3Ljc1IDM3NC41NSAxMDYuMDUKTCAzNzQuNTUgNTguOTUKUSAzNzMuNjUgNTMuNzUgMzY5LjQgNTMuNzUKTCAzMTguNzUgNTMuNzUKUSAzMTcuODUgNTQuMTUgMzE2Ljc1IDU0LjcgMzE0LjcgNTYuMTUgMzE0LjcgNTcuOApMIDMxNC43IDEwNi4wNSAzMTQuOSAxMDYuOApRIDMxNS4yNSAxMDcuNTUgMzE2LjM1IDEwNy41NQpMIDMyNC40NSAxMDcuNTUKUSAzMjUuOTUgMTA3Ljc1IDMyNS45NSAxMDYuMDUKTCAzMjUuOTUgNjcuOTUgMzI2LjMgNjYuNQpRIDMyNy4wNSA2NSAzMjguNSA2NQpMIDMzNi4wNSA2NSAzMzcuNTUgNjUuNTUKUSAzMzkgNjYuNSAzMzkgNjcuOTUKTCAzMzkgMTA2LjA1IDMzOS40IDEwNi44ClEgMzM5Ljk1IDEwNy41NSAzNDAuNjUgMTA3LjU1CkwgMzQ4Ljc1IDEwNy41NQpRIDM1MC4yNSAxMDcuMzUgMzUwLjI1IDEwNi4wNQpMIDM1MC4yNSA2Ny45NSAzNTAuOCA2Ni41ClEgMzUxLjU1IDY1IDM1Mi44NSA2NQpMIDM2MC40IDY1IDM2MS44NSA2NS43NQpNIDQ0NS40NSA1My43NQpRIDQ0NC4zNSA1My45NSA0NDMuMjUgNTQuNyA0NDAuODUgNTYuMTUgNDQwLjg1IDU4LjM1CkwgNDQwLjg1IDEwNS41IDQ0MS4wNSAxMDYuNgpRIDQ0MS40IDEwNy41NSA0NDIuNSAxMDcuNTUKTCA0NTAuNiAxMDcuNTUKUSA0NTIuMSAxMDcuNTUgNDUyLjEgMTA2LjA1CkwgNDUyLjEgNjcuOTUKUSA0NTIuMSA2Ny4yIDQ1Mi40NSA2Ni41IDQ1MyA2NSA0NTQuNjUgNjUKTCA0NzEuNCA2NSA0NzIuOSA2NS43NQpRIDQ3NC4zNSA2Ni42NSA0NzQuMzUgNjcuOTUKTCA0NzQuMzUgMTA1LjUgNDc0LjU1IDEwNi42ClEgNDc0LjkgMTA3LjU1IDQ3NS44NSAxMDcuNTUKTCA0ODMuOTUgMTA3LjU1ClEgNDg1LjYgMTA3Ljc1IDQ4NS42IDEwNC45NQpMIDQ4NS42IDU4LjM1ClEgNDg0LjUgNTMuNzUgNDgxIDUzLjc1CkwgNDQ1LjQ1IDUzLjc1Ck0gNDMwLjcgNTkuODUKUSA0MzAgNTUuNDUgNDI2LjMgNTUuNDUKTCAzODguMiA1NS40NQpRIDM4Ny4yNSA1NS42IDM4Ni41IDU2LjE1IDM4NC43IDU3LjI1IDM4NC43IDU4Ljk1CkwgMzg0LjcgMTAyIDM4NS44IDEwNC44ClEgMzg3LjI1IDEwNy41NSAzOTAuMiAxMDcuNTUKTCA0MjguMzUgMTA3LjU1ClEgNDMwLjU1IDEwNy41NSA0MjkuOCAxMDUuNQpMIDQyNi42NSA5OC45ClEgNDI1LjU1IDk3LjQgNDIzLjcgOTcuNApMIDM5OC4zIDk3LjQKUSAzOTQuOCA5Ni43IDM5NC44IDkzLjkKTCAzOTQuOCA4Ni4zNSA0MjYuMyA4Ni4zNQpRIDQzMC43IDg1LjQ1IDQzMC43IDgxLjc1CkwgNDMwLjcgNTkuODUKTSA0MjAuNiA2Ny45NQpMIDQyMC42IDczLjEKUSA0MjAuNiA3NS41IDQxOC4yIDc2LjI1CkwgMzk3LjQgNzYuMjUKUSAzOTUuNzUgNzYuMjUgMzk1LjIgNzQuOTUKTCAzOTQuOCA3My42NSAzOTQuOCA2Ny45NQpRIDM5NC44IDY2Ljg1IDM5Ni4xIDY2LjEgMzk2Ljg1IDY1Ljc1IDM5Ny40IDY1LjU1CkwgNDE4LjIgNjUuNTUKUSA0MjAuNCA2NS41NSA0MjAuNiA2Ny45NQpNIDUxNiA0MgpRIDUxNiA0MS4yNSA1MTUuOCA0MS4yNQpMIDUxNS40NSA0MS4yNQpRIDUxNS4wNSA0MC4zNSA1MTMuNzUgNDAuNwpMIDUwNS4zIDQzLjI1ClEgNTA0Ljk1IDQzLjQ1IDUwNC41NSA0My42NSA1MDMuODUgNDQuMiA1MDMuODUgNDUuMwpMIDUwMy44NSA1NC45IDQ5Ni4xIDU0LjkKUSA0OTUuNyA1NC45IDQ5NS4zNSA1NS4wNSA0OTQuNiA1NS42IDQ5NC42IDU2LjM1CkwgNDk0LjYgNjUuOSA1MDMuODUgNjUuOSA1MDMuODUgOTEuOSA1MDYuMDUgOTkuNDUKUSA1MTAuNDUgMTA3LjM1IDUyMC40IDEwOC42NQpMIDUzMy4zIDEwOC42NQpRIDUzNC42IDEwOC42NSA1MzMuNjUgMTA3CkwgNTI4LjUgOTcuOTUKUSA1MjguMTUgOTYuNSA1MjYuMSA5Ni41CkwgNTIzIDk2LjUKUSA1MjEuMyA5Ni4zIDUxOS41IDk1LjIgNTE2IDkzIDUxNiA4OC43NQpMIDUxNiA2Ni41IDUzMC41NSA2Ni41IDUzMC41NSA1Ni45ClEgNTMwLjM1IDU1LjQ1IDUyOS4wNSA1NS40NQpMIDUxNiA1NS40NSA1MTYgNDIKTSA1NzAuMSA1MC40NQpRIDU2OS45IDUwLjQ1IDU2OS44NSA1MC4zNSA1NjkuNyA0OS43NSA1NjkuNjUgNDkuMSA1NjkuNjUgNDguMiA1NjQuNCA0NC43NSA1NTkuMSA0MS4yNSA1NDYuMiAzMy43NSA1NDYgMzMuNzUgNTQ1LjggMzMuOCA1NDQuODUgMzQuMDUgNTQ0Ljg1IDMzLjMgNTQ0LjY1IDMzLjMgNTQ0LjQgMzMuMyA1NDQuNCAzMy41NSA1NDQuMzUgMzMuNTUgNTQzLjc1IDMzLjc1IDU0My4wNSAzMy43NSA1NDIuODUgMzMuNzUgNTQyLjcgMzMuODUgNTQxLjggMzQuNSA1NDAuOSAzNS4yIDU0MC42NSAzNS4zNSA1NDAuNDUgMzUuNTUgNTQwLjE1IDM1LjggNTM5LjkgMzYgNTM5LjkgMzYuMjUgNTM5LjkgMzYuNDUgNTM5LjkgMzYuNyA1MzkuOSAzNi45IDUzOS45IDM3LjE1IDUzOS45NSAzNy4zNSA1NDAuMiAzOC4zNSA1MzkuNDUgMzguMjUgNTM5LjQ1IDUxLjEgNTM5LjQ1IDYzLjk1IDUzOS40NSA2NC4yIDUzOS40NSA2NC40IDU0MC4yIDY0LjM1IDUzOS45NSA2NS4zNSA1MzkuOSA2NS41NSA1MzkuOSA2NS43NSA1NDAuMDUgNjYuMTUgNTQwLjI1IDY2LjU1IDU0MC45IDY3Ljc1IDU0Mi4wNSA2OC41IDU0Mi4zNSA2OC43IDU0Mi42NSA2OC44NSA1NDIuODUgNjguOTUgNTQzLjA1IDY4Ljk1IDU0My43NSA2OC45NSA1NDQuMzUgNjkuMTUgNTQ0LjQgNjkuMTUgNTQ0LjQgNjkuNCA1NDQuODUgNjkuNCA1NDUuMyA2OS40IDU0NS41NSA2OS40IDU0NS43NSA2OS40IDU0NS43NSA2OS4xNSA1NDUuNzUgNjguOTUgNTQ2IDY4Ljk1IDU0Ni4yIDY4Ljk1IDU0Ni40NSA2OC45NSA1NDYuNjUgNjguOTUgNTQ5LjkgNjcuMiA1NTMuMDUgNjUuNDUgNTUyLjUgNjUuNSA1NTEuODUgNjUuNSA1NDkuOTUgNjUuNSA1NDguNSA2NC42NSA1NDcgNjMuODUgNTQ2Ljk1IDYyLjY1IDU0Ni45IDYyLjA1IDU0Ny4zNSA2MS40NSA1NDcuNzUgNjAuOSA1NDguNiA2MS40NSA1NDkuOTUgNjIuNDUgNTUxLjkgNjIuNDUgNTUzLjIgNjIuNDUgNTUzLjkgNjEuNjUgNTU0LjUgNjEgNTU0LjUgNjAuMTUgNTU0LjUgNTkuMjUgNTU0LjI1IDU4LjggNTUzLjk1IDU4LjM1IDU1My4zNSA1OC4wNSA1NTIuNSA1Ny42NSA1NTAuODUgNTcuNiA1NTAgNTcuNiA1NDkuOCA1Ny4xCkwgNTQ5LjcgNTYKUSA1NDkuNyA1NS42IDU0OS45IDU1LjI1IDU1MC4xIDU0Ljg1IDU1MC41NSA1NC44NSA1NTEuMzUgNTQuNzUgNTUyLjU1IDU0Ljk1IDU1NC4zIDUzLjg1IDU1NC4zIDUyLjQgNTU0LjMgNTEuNjUgNTUzLjY1IDUxLjEgNTUyLjk1IDUwLjU1IDU1MS44NSA1MC41NSA1NTAuMiA1MC41NSA1NDguODUgNTEuMyA1NDguNDUgNTEuNTUgNTQ4LjEgNTEuNSA1NDcuNzUgNTEuNDUgNTQ3LjYgNTEgNTQ3LjM1IDQ5Ljk1IDU0Ny43NSA0OS4yIDU0OC4yIDQ4LjU1IDU0OS40NSA0OC4wNSA1NTAuNzUgNDcuNTUgNTUyLjIgNDcuNTUgNTU0Ljc1IDQ3LjU1IDU1Ni4yNSA0OC42IDU1Ny44IDQ5LjY1IDU1Ny43NSA1MS42NSA1NTcuNjUgNTQuNCA1NTUuMiA1NS42IDU1Ni43NSA1Ni4yIDU1Ny41NSA1Ny4yNSA1NTguNCA1OC40IDU1OC40IDYwIDU1OC40IDYxLjUgNTU3LjggNjIuNjUgNTU4LjYgNjIuMTUgNTU5Ljc1IDYxLjQ1CkwgNTYxIDYwLjcKUSA1NjEuMDUgNjAuNjUgNTYxLjEgNjAuNjUgNTYxLjM1IDYwLjU1IDU2MS41NSA2MC41IDU2MS44NSA2MC4zNSA1NjQuMSA1OC41NSA1NjYuMzUgNTYuNzUgNTY3Ljk1IDU1LjE1IDU2OS41NSA1My42IDU2OS42NSA1My42IDU2OS42NSA1My4zNSA1NjkuNjUgNTMuMTUgNTY5LjY1IDUyLjkgNTY5LjY1IDUyLjcgNTY5LjkgNTIuNyA1NzAuMSA1Mi43IDU3MC4xIDUyLjQ1IDU3MC4xIDUyLjI1IDU3MC4xIDUxLjM1IDU3MC4xIDUwLjQ1IFoiLz4KCjxwYXRoIGZpbGw9IiM5MUMyMzMiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTE4LjA1IDMxLjg1CkwgMTE0Ljk1IDMwLjA1IDYzLjkgNTkuODUKUSA2My4xNSA2MC40IDYyLjQ1IDYxLjUgNjAuOTUgNjMuNTUgNjAuOTUgNjYuNQpMIDYwLjk1IDc4LjI1IDEwOSA0OSAxMDkgNjAuNApRIDEwOSA2My43IDEwNyA2NS43NQpMIDY0LjQ1IDkxLjM1IDYyLjggOTMuNTUKUSA2MC45NSA5Ni4xIDYwLjk1IDk4LjkKTCA2MC45NSAxMTAuMSAxMDkgODEgMTA5IDkzLjc1ClEgMTA5IDk0LjU1IDEwOC45NSA5NS4yNQpMIDY0LjQ1IDEyMS44NSA2Mi44IDEyNC4wNQpRIDYyLjYgMTI0LjMgNjIuNDUgMTI0LjYgNjEgMTI2LjggNjAuOTUgMTI5LjI1CkwgNjAuOTUgMTQwLjYgMTA5IDExMS41IDEwOSAxMTEuNTUgMTE5LjUgMTA1LjM1ClEgMTE5LjcgMTA1LjI1IDExOS45NSAxMDUuMTUgMTIwLjU1IDEwNC44IDEyMS4wNSAxMDQuMyAxMjIuNSAxMDIuNiAxMjIuNjUgOTkKTCAxMjIuNjUgMzkuNApRIDEyMy4yIDM0LjI1IDExOC4wNSAzMS44NQpNIDEyMSAzOC45NQpMIDEyMSAzOC41ClEgMTIxIDM4LjA1IDEyMC45NSAzNy42NSAxMjEuMDUgMzguMyAxMjEgMzguOTUKTSAxMTYuMSAzMi4yCkwgMTE3LjcgMzMuMTUKUSAxMTYuOSAzMi43NSAxMTYgMzIuNiAxMTUuNzUgMzIuNTUgMTE2LjEgMzIuMgpNIDY2IDEyNi40NQpMIDY1Ljk1IDEyNi40NSA2NS45NSAxMjYuNCA2NiAxMjYuNDUgWiIvPgoKPHBhdGggZmlsbD0iIzAwNkI5QiIgZmlsbC1vcGFjaXR5PSIwLjY3NDUwOTgwMzkyMTU2ODciIHN0cm9rZT0ibm9uZSIgZD0iCk0gNTQ2LjggMzIuOApRIDU0NyAzMi43NSA1NDcuMiAzMi43NSA1NDcuMiAzMi41NSA1NDcuMiAzMi4zIDU0NyAzMi4zIDU0Ni43NSAzMi4zIDU0Ni4zIDMyLjMgNTQ1Ljg1IDMyLjMgNTQ1Ljg1IDMzLjA1IDU0Ni44IDMyLjggWiIvPgoKPHBhdGggZmlsbD0iIzAwNTI3NyIgZmlsbC1vcGFjaXR5PSIwLjUxNzY0NzA1ODgyMzUyOTUiIHN0cm9rZT0ibm9uZSIgZD0iCk0gNTcwLjY1IDUxLjcKUSA1NzAuNjUgNTEuOSA1NzAuNjUgNTIuMTUgNTcwLjY1IDUyLjM1IDU3MC42NSA1Mi42IDU3MC45IDUyLjYgNTcxLjEgNTIuNiA1NzEuMSA1Mi4zNSA1NzEuMSA1Mi4xNSA1NzEuMSA1MS45IDU3MS4xIDUxLjcgNTcwLjkgNTEuNyA1NzAuNjUgNTEuNyBaIi8+Cgo8cGF0aCBmaWxsPSIjMDAwNjA5IiBmaWxsLW9wYWNpdHk9IjAuMDQzMTM3MjU0OTAxOTYwNzg0IiBzdHJva2U9Im5vbmUiIGQ9IgpNIDU0Mi4wNSA2OC41ClEgNTQwLjkgNjcuNzUgNTQwLjI1IDY2LjU1IDU0MC4zNSA2OC4zIDU0Mi4wNSA2OC41IFoiLz4KCjxwYXRoIGZpbGw9IiMwMDVDODUiIGZpbGwtb3BhY2l0eT0iMC41ODAzOTIxNTY4NjI3NDUxIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDU0NS4zNSAzMi41NQpRIDU0NS40IDMyLjU1IDU0NS40IDMyLjMgNTQ1LjIgMzIuMyA1NDQuOTUgMzIuMyA1NDQuNSAzMi4zIDU0NC4wNSAzMi4zIDU0NC4wNSAzMi41NSA1NDQuMDUgMzIuNzUgNTQ0Ljc1IDMyLjc1IDU0NS4zNSAzMi41NSBaIi8+Cgo8cGF0aCBmaWxsPSIjMDAwNzBBIiBmaWxsLW9wYWNpdHk9IjAuMDQzMTM3MjU0OTAxOTYwNzg0IiBzdHJva2U9Im5vbmUiIGQ9IgpNIDU0MC40NSAzNS40NQpRIDU0MC40NSAzNS41IDU0MC40NSAzNS41NSA1NDAuNjUgMzUuMzUgNTQwLjkgMzUuMiA1NDAuOSAzNS4xIDU0MC45IDM1IDU0Mi4yNSAzMy45IDU0My43IDMyLjg1IDU0My44NSAzMi43NSA1NDQuMDUgMzIuNzUgNTQ0LjA1IDMyLjU1IDU0NC4wNSAzMi4zIDU0My44NSAzMi4zIDU0My42IDMyLjMgNTQyIDMyLjMgNTQwLjQ1IDMyLjMgNTQwLjQ1IDMzLjg1IDU0MC40NSAzNS40NSBaIi8+Cgo8cGF0aCBmaWxsPSIjMDA2MjhFIiBmaWxsLW9wYWNpdHk9IjAuNjE5NjA3ODQzMTM3MjU0OSIgc3Ryb2tlPSJub25lIiBkPSIKTSA1NzEuMSA0OC4xClEgNTcwLjkgNDguMSA1NzAuNjUgNDguMSA1NzAuNyA0OC43NSA1NzAuODUgNDkuMzUgNTcwLjkgNDkuNDUgNTcxLjEgNDkuNDUgNTcxLjEgNDkuMiA1NzEuMSA0OSA1NzEuMSA0OC41NSA1NzEuMSA0OC4xIFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC4yNjk1NDY1MDg3ODkwNjI1LCAwLCAwLCAwLjI2OTU0NjUwODc4OTA2MjUsIDAuMzUsMC4yNSkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIxXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=" alt="element-logo" class="nav-logo" data-v-88c41124="">
</p>

<p align="center">
  <a href="https://travis-ci.org/ElemeFE/element">
    <img src="https://travis-ci.org/ElemeFE/element.svg?branch=master">
  </a>
  <a href="https://coveralls.io/github/ElemeFE/element?branch=master">
    <img src="https://coveralls.io/repos/github/ElemeFE/element/badge.svg?branch=master">
  </a>
  <a href="https://cdnjs.com/libraries/element-ui">
    <img src="https://img.shields.io/cdnjs/v/element-ui.svg">
  </a>
  <a href="https://www.npmjs.org/package/element-ui">
    <img src="https://img.shields.io/npm/v/element-ui.svg">
  </a>
  <a href="https://npmcharts.com/compare/element-ui?minimal=true">
    <img src="http://img.shields.io/npm/dm/element-ui.svg">
  </a>
  <br>
  <a href="http://img.badgesize.io/https://unpkg.com/element-ui/lib/index.js?compression=gzip&label=gzip%20size:%20JS">
    <img src="http://img.badgesize.io/https://unpkg.com/element-ui/lib/index.js?compression=gzip&label=gzip%20size:%20JS">
  </a>
  <a href="http://img.badgesize.io/https://unpkg.com/element-ui/lib/theme-chalk/index.css?compression=gzip&label=gzip%20size:%20CSS">
    <img src="http://img.badgesize.io/https://unpkg.com/element-ui/lib/theme-chalk/index.css?compression=gzip&label=gzip%20size:%20CSS">
  </a>
  <a href="#backers">
    <img src="https://opencollective.com/element/backers/badge.svg">
  </a>
  <a href="#sponsors">
    <img src="https://opencollective.com/element/sponsors/badge.svg">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

<p align="center">
  <b>Special thanks to the generous sponsorship by:</b>
</p>
<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://tipe.io/?ref=element" target="_blank">
          <img width="150px" src="https://user-images.githubusercontent.com/1016365/34124854-48fafa06-e3e9-11e7-8c04-251055feebee.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://www.duohui.cn/?utm_source=element&utm_medium=web&utm_campaign=element-index" target="_blank">
          <img width="150px" src="https://user-images.githubusercontent.com/10095631/35603534-bb24470c-0678-11e8-8bcc-17ceaef8cbef.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://bitsrc.io/" target="_blank">
          <img width="150px" src="https://user-images.githubusercontent.com/10095631/41342907-e44e7196-6f2f-11e8-92f2-47702dc8f059.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

> A Vue.js 3.0 UI Toolkit for Web.（WIP）

## Links

- Homepage and documentation
  - [International users](http://element.eleme.io/#/en-US)
  - [Chinese users](http://element-cn.eleme.io/#/zh-CN)
  - [Spanish users](http://element.eleme.io/#/es)
  - [French users](http://element.eleme.io/#/fr-FR)
- [awesome-element](https://github.com/ElementUI/awesome-element)
- [FAQ](./FAQ.md)
- [Customize theme](http://element.eleme.io/#/en-US/component/custom-theme)
- [Preview and generate theme online](https://elementui.github.io/theme-chalk-preview)
- [Element for React](https://github.com/elemefe/element-react)
- [Element for Angular](https://github.com/ElemeFE/element-angular)
- [Atom helper](https://github.com/ElemeFE/element-helper)
- [Visual Studio Code helper](https://github.com/ElemeFE/vscode-element-helper)
- Starter kit
  - [element-starter](https://github.com/ElementUI/element-starter)
  - [element-in-laravel-starter](https://github.com/ElementUI/element-in-laravel-starter)
- [Design resources](https://github.com/ElementUI/Resources)
- Gitter
  - [International users](https://gitter.im/element-en/Lobby)
  - [Chinese users](https://gitter.im/ElemeFE/element)

## Install

```shell
npm install element-ui -S
```

## Quick Start

```javascript
import Vue from 'vue'
import Element from 'element-ui'

Vue.use(Element)

// or
import {
  Select,
  Button
  // ...
} from 'element-ui'

Vue.component(Select.name, Select)
Vue.component(Button.name, Button)
```

For more information, please refer to [Quick Start](http://element.eleme.io/#/en-US/component/quickstart) in our documentation.

## Browser Support

Modern browsers and Internet Explorer 10+.

## Development

Skip this part if you just want to use Element.

For those who are interested in contributing to Element, please refer to our contributing guide ([中文](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.zh-CN.md) | [English](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.en-US.md) | [Español](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.es.md) | [Français](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.fr-FR.md)) to see how to run this project.

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/ElemeFE/element/releases).

## FAQ

We have collected some [frequently asked questions](https://github.com/ElemeFE/element/blob/master/FAQ.md). Before reporting an issue, please search if the FAQ has the answer to your problem.

## Contribution

Please make sure to read the contributing guide ([中文](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.zh-CN.md) | [English](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.en-US.md) | [Español](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.es.md) | [Français](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.fr-FR.md)) before making a pull request.

[![Let's fund issues in this repository](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/repos/67274736)

## Special Thanks

English documentation is brought to you by SwiftGG Translation Team:

- [raychenfj](https://github.com/raychenfj)
- [kevin](http://thekevin.cn/)
- [曾小涛](https://github.com/zengxiaotao)
- [湾仔王二](https://github.com/wanzaiwanger)
- [BlooDLine](http://www.ibloodline.com/)
- [陈铭嘉](https://chenmingjia.github.io/)
- [千叶知风](http://mpc6.com/)
- [梁杰](http://numbbbbb.com)
- [Changing](https://github.com/sunzhuo11)
- [mmoaay](https://github.com/mmoaay)

Spanish documentation is made possible by these community developers:

- [adavie1](https://github.com/adavie1)
- [carmencitaqiu](https://github.com/carmencitaqiu)
- [coderdiaz](https://github.com/coderdiaz)
- [fedegar33](https://github.com/fedegar33)
- [Gonzalo2310](https://github.com/Gonzalo2310)
- [lesterbx](https://github.com/lesterbx)
- [ProgramerGuy](https://github.com/ProgramerGuy)
- [SantiagoGdaR](https://github.com/SantiagoGdaR)
- [sigfriedCub1990](https://github.com/sigfriedCub1990)
- [thechosenjuan](https://github.com/thechosenjuan)

French documentation is made possible by these community developers:

- [smalesys](https://github.com/smalesys)
- [blombard](https://github.com/blombard)

<!-- ## Donation
If you find Element useful, you can buy us a cup of coffee

<img width="650" src="https://user-images.githubusercontent.com/14025786/44833997-5d7c4d80-ac62-11e8-8445-1dffec0eb13c.png" alt="donation"> -->

## Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/element#backer)]

<a href="https://opencollective.com/element/backer/0/website" target="_blank"><img src="https://opencollective.com/element/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/1/website" target="_blank"><img src="https://opencollective.com/element/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/2/website" target="_blank"><img src="https://opencollective.com/element/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/3/website" target="_blank"><img src="https://opencollective.com/element/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/4/website" target="_blank"><img src="https://opencollective.com/element/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/5/website" target="_blank"><img src="https://opencollective.com/element/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/6/website" target="_blank"><img src="https://opencollective.com/element/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/7/website" target="_blank"><img src="https://opencollective.com/element/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/8/website" target="_blank"><img src="https://opencollective.com/element/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/9/website" target="_blank"><img src="https://opencollective.com/element/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/10/website" target="_blank"><img src="https://opencollective.com/element/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/11/website" target="_blank"><img src="https://opencollective.com/element/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/12/website" target="_blank"><img src="https://opencollective.com/element/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/13/website" target="_blank"><img src="https://opencollective.com/element/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/14/website" target="_blank"><img src="https://opencollective.com/element/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/15/website" target="_blank"><img src="https://opencollective.com/element/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/16/website" target="_blank"><img src="https://opencollective.com/element/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/17/website" target="_blank"><img src="https://opencollective.com/element/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/18/website" target="_blank"><img src="https://opencollective.com/element/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/19/website" target="_blank"><img src="https://opencollective.com/element/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/20/website" target="_blank"><img src="https://opencollective.com/element/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/21/website" target="_blank"><img src="https://opencollective.com/element/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/22/website" target="_blank"><img src="https://opencollective.com/element/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/23/website" target="_blank"><img src="https://opencollective.com/element/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/24/website" target="_blank"><img src="https://opencollective.com/element/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/25/website" target="_blank"><img src="https://opencollective.com/element/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/26/website" target="_blank"><img src="https://opencollective.com/element/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/27/website" target="_blank"><img src="https://opencollective.com/element/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/28/website" target="_blank"><img src="https://opencollective.com/element/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/element/backer/29/website" target="_blank"><img src="https://opencollective.com/element/backer/29/avatar.svg"></a>

## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/element#sponsor)]

<a href="https://opencollective.com/element/sponsor/0/website" target="_blank"><img src="https://opencollective.com/element/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/1/website" target="_blank"><img src="https://opencollective.com/element/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/2/website" target="_blank"><img src="https://opencollective.com/element/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/3/website" target="_blank"><img src="https://opencollective.com/element/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/4/website" target="_blank"><img src="https://opencollective.com/element/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/5/website" target="_blank"><img src="https://opencollective.com/element/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/6/website" target="_blank"><img src="https://opencollective.com/element/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/7/website" target="_blank"><img src="https://opencollective.com/element/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/8/website" target="_blank"><img src="https://opencollective.com/element/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/9/website" target="_blank"><img src="https://opencollective.com/element/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/10/website" target="_blank"><img src="https://opencollective.com/element/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/11/website" target="_blank"><img src="https://opencollective.com/element/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/12/website" target="_blank"><img src="https://opencollective.com/element/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/13/website" target="_blank"><img src="https://opencollective.com/element/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/14/website" target="_blank"><img src="https://opencollective.com/element/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/15/website" target="_blank"><img src="https://opencollective.com/element/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/16/website" target="_blank"><img src="https://opencollective.com/element/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/17/website" target="_blank"><img src="https://opencollective.com/element/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/18/website" target="_blank"><img src="https://opencollective.com/element/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/19/website" target="_blank"><img src="https://opencollective.com/element/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/20/website" target="_blank"><img src="https://opencollective.com/element/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/21/website" target="_blank"><img src="https://opencollective.com/element/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/22/website" target="_blank"><img src="https://opencollective.com/element/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/23/website" target="_blank"><img src="https://opencollective.com/element/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/24/website" target="_blank"><img src="https://opencollective.com/element/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/25/website" target="_blank"><img src="https://opencollective.com/element/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/26/website" target="_blank"><img src="https://opencollective.com/element/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/27/website" target="_blank"><img src="https://opencollective.com/element/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/28/website" target="_blank"><img src="https://opencollective.com/element/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/element/sponsor/29/website" target="_blank"><img src="https://opencollective.com/element/sponsor/29/avatar.svg"></a>

## LICENSE

[MIT](LICENSE)
