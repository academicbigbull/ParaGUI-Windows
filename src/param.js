/**
 * ParaGUI Parameter Model Engine
 * 把 CSS 自定义属性映射为三类参数对象
 */
const ParaGUI = (() => {
    const root = document.documentElement;
  
    /* 1. 参数定义表（单位/范围/默认值） */
    const schema = {
      geometry: {
        '--page-w':   {unit:'px',min:800,max:1600,default:'1200px'},
        '--fg-w':     {unit:'px',min:120, max:300, default:'180px'},
        '--btn-w':    {unit:'px',min:60,  max:150, default:'80px'},
        '--btn-h':    {unit:'px',min:24,  max:60,  default:'30px'},
        '--col-w':    {unit:'px',min:80,  max:200, default:'120px'},
        '--modal-w':  {unit:'px',min:300, max:600, default:'400px'},
        '--modal-h':  {unit:'px',min:200, max:500, default:'300px'}
      },
      style: {
        '--fs':       {unit:'px',min:12,  max:24,  default:'14px'},
        '--line-height':{unit:'num',min:1.2,max:2,default:1.5}
      },
      behavior: {
        '--resize-disabled':{unit:'flag',values:['none','both'],default:'none'}
      }
    };
  
    /* 2. Getter */
    function getAll(){
      const obj = {};
      for(const cat in schema){
        obj[cat] = {};
        for(const key in schema[cat]){
          obj[cat][key] = getComputedStyle(root).getPropertyValue(key).trim();
        }
      }
      return obj;
    }
  
    /* 3. Setter（带边界校验） */
    function set(key,val){
      const [cat] = Object.entries(schema).find(([,v])=>v[key]) || [];
      if(!cat) return console.warn('Unknown param:',key);
      const rule = schema[cat][key];
      const num = parseFloat(val);
      if(rule.unit==='px' && (num<rule.min||num>rule.max)) return console.warn('Out of range:',key,val);
      root.style.setProperty(key,val);
    }
  
    /* 4. 重置 */
    function reset(){
      for(const cat in schema){
        for(const key in schema[cat]){
          const def = schema[cat][key].default;
          root.style.setProperty(key,def);
        }
      }
    }
  
    /* 暴露 API */
    return { getAll, set, reset, schema };
  })();