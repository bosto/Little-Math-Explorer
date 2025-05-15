# 数学小探险家 Little Math Explorer

## 游戏简介 (Game Overview)

"数学小探险家"是一款专为小学一年级学生设计的网页数学游戏，帮助孩子们巩固三位数加减法和九九乘法表基础，提升数学兴趣与运算能力。

"Little Math Explorer" is a web-based math game designed for first-grade students, helping children master three-digit addition/subtraction and multiplication tables, while fostering interest and skills in math.

---

## 1. 游戏名称 (Game Name)
- 数学小探险家 (Shùxué Xiǎo Tànxiǎn Jiā - Little Math Explorer)
- 备选: 算术小能手 (Arithmetic Whiz Kid), 数字智慧星 (Number Wisdom Star)

## 2. 目标用户 (Target Audience)
- 小学一年级学生（6-7岁）
- 需要巩固三位数加减法及乘法表基础知识的儿童

## 3. 平台 (Platform)
- 网页游戏（Web Game）
- 技术栈: HTML5, CSS3, JavaScript
- 设计原则: 移动优先，兼容手机、平板和桌面浏览器

## 4. 教育目标 (Educational Objectives)
- 熟练进行1000以内三位数加减法（含进/退位）
- 熟记九九乘法表
- 提升兴趣、速度、准确率和专注力

## 5. 核心玩法 (Core Gameplay)
- 屏幕中央显示题目，玩家用数字键盘输入答案
- 答案提交后即时反馈（视觉+音效）
- 正确得分并有动画奖励，错误给予鼓励提示

## 6. 游戏模式 (Game Modes)
- 三位数加法大闯关（Addition Challenge）
- 三位数减法大作战（Subtraction Battle）
- 乘法口诀小明星（Multiplication Table Star）
- 混合速算王（Mixed Calculation King，可选）

## 7. 题目生成规则 (Problem Generation Rules)
- 加法：100-999随机两数相加，和在200-1998
- 减法：200-999随机被减数，减数确保差为正且不少于两位数
- 乘法：1-9随机两数相乘

## 8. 用户界面与体验 (UI & UX Design)
- 明亮活泼的糖果色系，卡通圆角元素
- 大号清晰字体，适合儿童阅读
- 主界面有模式选择大按钮，卡通背景
- 游戏界面：题目区、答案输入框、数字键盘、反馈区、得分/进度条
- 交互流程：选择模式→答题→反馈→结算
- 结算界面：得分、正确率、评价、再玩一次/返回主菜单

## 9. 美术风格与音效 (Art Style & Sound Effects)
- 可爱吉祥物引导与反馈
- 简洁流畅动画，按钮点击、答题反馈弹出效果
- 轻快儿童BGM，按键音、答题音效、结算音效

## 10. 激励与进度系统 (Incentive & Progression)
- 答对得分，连击奖励
- 阶段性星星奖励，虚拟徽章/奖状（可选）
- 最高分本地存储，鼓励性语言贯穿始终

## 11. 技术实现建议 (Technical Implementation)
- 前端核心：原生JavaScript，HTML语义化结构，CSS Flexbox/Grid响应式布局
- 动画用CSS Transitions/Animations
- 题目生成、键盘输入、答案校验、反馈、计分、音效、本地存储等模块化
- 素材优先SVG，音效mp3/ogg

## 12. 扩展性考虑 (Future Expansion)
- 难度等级选择、限时挑战、更多运算类型、个性化设置、学习报告、多语言支持

## 13. 关键设计原则 (Key Design Principles)
- 儿童友好、简洁直观、即时反馈、正向激励、趣味性、教育性、无干扰

---

## 快速开始 (Quick Start)

1. 克隆本项目 (Clone this repo):
   ```bash
   git clone <your-repo-url>
   ```
2. 打开 `index.html` 即可在浏览器体验游戏。

---

## 版权声明 (License)

本项目仅用于学习与教学用途。

---

祝您的数学游戏项目顺利成功！ 