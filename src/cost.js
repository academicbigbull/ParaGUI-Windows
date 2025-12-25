/**
 * ParaGUI Cost Function
 * 量化布局混乱程度 → 供约束求解器最小化
 */
function calcCost(){
    let overlapArea  = 0;   // 重叠像素面积
    let overflowCols = 0;   // 表格列被挤掉数量
    let smallFonts   = 0;   // 字号<12 px 的控件数
  
    /* 1. 按钮重叠检测（简易轴对齐矩形法） */
    const btns = [...document.querySelectorAll('.btn-group button')];
    console.log('按钮数量=', btns.length);   // 应该=9
    for(let i=0;i<btns.length;i++){
      for(let j=i+1;j<btns.length;j++){
        const r1=btns[i].getBoundingClientRect();
        const r2=btns[j].getBoundingClientRect();
        const overlapW = Math.max(0, Math.min(r1.right,r2.right) - Math.max(r1.left,r2.left));
        const overlapH = Math.max(0, Math.min(r1.bottom,r2.bottom) - Math.max(r1.top,r2.top));
        overlapArea += overlapW * overlapH;
      }
    }
  
    /* 2. 表格列溢出检测 */
    const table = document.querySelector('.data-table');
    const container = document.querySelector('.table-container');
    if (!table || !container) return Infinity;          //  保护
    const tableWidth = document.querySelector('.data-table').clientWidth;
    const containerWidth = document.querySelector('.table-container').clientWidth;
    if(tableWidth > containerWidth) overflowCols = 1; // 简化：只要出现横向滚动就算 1
  
    /* 3. 小字号检测 */
    const elems = [...document.querySelectorAll('.form-group input,button,textarea')];
    elems.forEach(el=>{
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if(fs<12) smallFonts++;
    });
  
    /* 4. 综合代价（可加权） */
    const cost = overlapArea + overflowCols*500 + smallFonts*50;
    console.log('【Cost】', {overlapArea, overflowCols, smallFonts, total:cost});
    return cost;
  }
  
  /* 每次参数变化后自动计算 */
  window.addEventListener('resize', ()=> calcCost());