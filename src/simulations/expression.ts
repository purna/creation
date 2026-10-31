/** Small arithmetic parser for editable maths nodes. No eval or dynamic JavaScript. */
export function evaluateExpression(source:string,a:number,b:number):number{
 if(source.length>160)throw Error('Equation is too long');
 const tokens=source.replace(/\s+/g,'').match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[ABab()+*/^\-]/g)||[];
 if(tokens.join('')!==source.replace(/\s+/g,''))throw Error('Use only A, B, numbers, +, -, *, /, ^ and parentheses');
 let pos=0;const peek=()=>tokens[pos];const take=()=>tokens[pos++];
 function primary():number{const t=take();if(t==='('){const v=sum();if(take()!==')')throw Error('Missing closing parenthesis');return v}if(t==='-')return -power();if(t==='+')return power();if(t==='A'||t==='a')return a;if(t==='B'||t==='b')return b;if(t&&/^(?:\d|\.)/.test(t))return Number(t);throw Error('Expected number, A, B or (')}
 function power():number{const left=primary();return peek()==='^'?(take(),left**power()):left}
 function product():number{let v=power();while(peek()==='*'||peek()==='/'){const op=take(),right=power();v=op==='*'?v*right:v/right}return v}
 function sum():number{let v=product();while(peek()==='+'||peek()==='-'){const op=take(),right=product();v=op==='+'?v+right:v-right}return v}
 const value=sum();if(pos!==tokens.length)throw Error('Unexpected token');if(!Number.isFinite(value))throw Error('Equation produces a non-finite result');return value;
}
